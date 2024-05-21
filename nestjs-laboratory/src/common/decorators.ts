import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
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

export function ApiErrorResponse(statusCode: HttpStatusCode, ...dtos: ErrorResponse[]) {
  const errorDto = dtos.map((e) => e.type);

  const schemas = makeSchemaPath(errorDto);
  const extraModels = makeExtraModels(errorDto);
  const example = makeExample(dtos);
  console.log(schemas, ...extraModels);
  return applyDecorators(
    ApiExtraModels(...extraModels),
    ApiResponse({
      status: statusCode,
      content: {
        'application/json': {
          examples: example,
          schema: {
            oneOf: schemas,
          },
        },
      },
    }),
  );
}

export function ApiErrorResponseV2(statusCode: HttpStatusCode, ...dtos: ErrorResponse[]): ClassDecorator & MethodDecorator {
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

  const groupedMetadata: GrouppedMetadata = {
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
        const metadataValue = responses; // 재고가 없습니다.

        groupedMetadata['400'].content['application/json'].examples = {
          ...content['application/json'].examples,
          ...metadataValue['400'].content['application/json'].examples,
        };
        if (models.length) {
          const schemaPath = makeSchemaPath(models);
          // console.log([...content['application/json'].schema.oneOf, ...schemaPath]);
          groupedMetadata['400'].content['application/json'].schema.oneOf = {
            ...content['application/json'].schema.oneOf,
            ...schemaPath,
          };
        }
      }

      Reflect.defineMetadata(
        DECORATORS.API_RESPONSE,
        {
          ...responses,
          ...groupedMetadata,
        },

        descriptor.value,
      );
      console.log([...models, ...extraModels]);
      const eerge = [...models, ...extraModels];
      Reflect.defineMetadata(
        DECORATORS.API_EXTRA_MODELS,
        eerge,

        descriptor.value,
      );
      return descriptor;
    }
    applyClassDecorator(target, dtos);

    return target;
  };
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

export type MetaContent = Record<string, ContentObject>;
export const getApiResponseContent = (descriptor?: PropertyDescriptor): Record<string, MetaContent> => {
  return Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor?.value);
};

export const applyClassDecorator = (target: any, exceptions: ErrorResponse[]) => {
  for (const key of Object.getOwnPropertyNames(target.prototype)) {
    const methodDescriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
    const metadata = Reflect.getMetadata(DECORATORS.API_RESPONSE, methodDescriptor!.value);
    if (metadata) {
      const decorator = ApiErrorResponseV2(400, ...exceptions);
      decorator(target, key, methodDescriptor!);
    }
  }
};
