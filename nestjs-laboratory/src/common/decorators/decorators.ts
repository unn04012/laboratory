import { getSchemaPath } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { ContentObject, ExamplesObject, ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export type HttpStatusCode = 400 | 404;

export type ErrorResponse = {
  errorCode?: string;
  description?: string;
  type: Function;
};

type GrouppedMetadata = {
  [x: number]: {
    content: {
      'application/json': {
        examples: ExamplesObject;
        schema: {
          oneOf: (ReferenceObject | SchemaObject)[];
        };
      };
    };
    type: undefined;
    isArray: undefined;
    description: string;
  };
};
export type MetaContent = Record<string, ContentObject>;

export function ApiErrorResponse(statusCode: HttpStatusCode, ...dtos: ErrorResponse[]): ClassDecorator & MethodDecorator {
  const errorDto = dtos.map((e) => e.type);

  const schemas = makeSchemaPath(errorDto);
  const extraModels = makeExtraModels(errorDto);
  const example = makeExample(dtos);

  const content = {
    'application/json': {
      examples: example,
      schema: {
        oneOf: schemas,
      },
    },
  };

  let groupedMetadata: GrouppedMetadata = {
    [statusCode]: {
      content,
      type: undefined,
      isArray: undefined,
      description: '',
    },
  };

  return (target: any, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    if (descriptor) {
      const responses = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value) || {};
      const models = Reflect.getMetadata(DECORATORS.API_EXTRA_MODELS, descriptor.value) || [];
      if (Object.keys(responses).length) {
        const metadataValue = responses as GrouppedMetadata;
        if (models.length) {
          const schemaPath = makeSchemaPath(models);

          groupedMetadata[statusCode].content['application/json'].schema.oneOf = [...content['application/json'].schema.oneOf, ...schemaPath];
        }
        groupedMetadata = mergeGrouppedMetadataByStatsuCode(groupedMetadata, metadataValue, statusCode);
      }

      Reflect.defineMetadata(DECORATORS.API_EXTRA_MODELS, [...models, ...extraModels], descriptor.value);
      Reflect.defineMetadata(
        DECORATORS.API_RESPONSE,
        {
          ...responses,
          ...groupedMetadata,
        },

        descriptor.value,
      );

      return descriptor;
    }
    applyClassDecorator(statusCode, target, dtos);

    return target;
  };
}

/**
 * @param target 원본
 * @param source 대상
 */
function mergeGrouppedMetadataByStatsuCode(target: GrouppedMetadata, source: GrouppedMetadata, statusCode: HttpStatusCode) {
  if (source[statusCode]) {
    target[statusCode].content['application/json'].examples = {
      ...target[statusCode].content['application/json'].examples,
      ...source[statusCode].content['application/json'].examples,
    };
  } else {
    target[statusCode].content['application/json'].examples = {
      ...target[statusCode].content['application/json'].examples,
    };
  }

  return target;
}

/**
 * extraModel과 getSchemaPath를 동시에 등록하는 파라미터를 제공합니다.
 * @param errorClasses
 */
function makeSchemaPath(errorClasses: Function[]): (SchemaObject | ReferenceObject)[] {
  if (Array.isArray(errorClasses)) {
    return errorClasses.map((e) => ({ $ref: getSchemaPath(e) }));
  } else {
    return [{ $ref: getSchemaPath(errorClasses) }];
  }
}

function makeExtraModels(dtos: Function[]): Function[] {
  if (Array.isArray(dtos)) return dtos;

  return [dtos];
}

function makeExample(dtos: ErrorResponse | ErrorResponse[]): ExamplesObject {
  const commonMessage = {
    message: 'string',
    path: 'api path',
    method: 'http method',
  };
  if (Array.isArray(dtos)) {
    let examples: ExamplesObject = {};
    for (let i = 0; i < dtos.length; i++) {
      const e = dtos[i];

      const title = e.description ?? `${i} title`;
      const errorCode = e.errorCode ?? 'errorCode';

      const example = {
        [title]: {
          value: {
            code: errorCode,
            ...commonMessage,
          },
        },
      };
      examples = { ...examples, ...example };
    }

    return examples;
  } else {
    const { errorCode, description } = dtos;
    const title = description ?? '특정 상황';
    const code = errorCode ?? 'errorCode';
    return {
      [title]: {
        value: {
          code,
          ...commonMessage,
        },
      },
    };
  }
}

const applyClassDecorator = (httpStatusCode: HttpStatusCode, target: any, exceptions: ErrorResponse[]) => {
  for (const key of Object.getOwnPropertyNames(target.prototype)) {
    const methodDescriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
    const metadata = Reflect.getMetadata(DECORATORS.API_OPERATION, methodDescriptor!.value);
    if (metadata) {
      const decorator = ApiErrorResponse(httpStatusCode, ...exceptions);
      decorator(target, key, methodDescriptor!);
    }
  }
};
