import { getSchemaPath } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import {
  ExamplesObject,
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { HttpBaseException } from '../../exceptions/http-base-exception';

export type ApiErrorOptions = {
  summary?: string;
  description?: string;
  status?: number;
  error: new (...args: any[]) => HttpBaseException;
};

type MetadataContent = {
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

type GroupedMetadata = {
  [statusCode: number]: MetadataContent;
};

export function makeGroupedMetadata(
  errors: ApiErrorOptions[],
): GroupedMetadata {
  const groupedMetadata: GroupedMetadata = errors.reduce((acc, option) => {
    const instance = new option.error('Example error message');
    const statusCode = Number(option.status || instance.statusCode);

    // 기존 항목이 없으면 초기화
    if (!acc[statusCode]) {
      acc[statusCode] = {
        content: {
          'application/json': {
            schema: {
              oneOf: [{ $ref: getSchemaPath(HttpBaseException) }],
            },
            examples: {},
          },
        },
        type: undefined,
        isArray: undefined,
        description: option.description || '',
      };
    }

    // examples에 새로운 예시 추가
    if (option.error.name) {
      acc[statusCode].content['application/json'].examples[option.error.name] =
        {
          summary: option.summary || '',
          description: option.description || '',
          value: {
            statusCode: instance.statusCode,
            code: instance.code,
            message: instance.message,
          },
        };
    }

    return acc;
  }, {} as GroupedMetadata);

  return groupedMetadata;
}

export function ApiError(
  ...options: ApiErrorOptions[]
): ClassDecorator & MethodDecorator {
  const groupedMetadata = makeGroupedMetadata(options);

  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    // method decorator
    if (descriptor) {
      const apiResponses = getApiResponseContent(descriptor);

      for (const [statusCode, newContent] of Object.entries(groupedMetadata)) {
        const existingContent = apiResponses?.[statusCode];
        if (existingContent) {
          // 기존에 statusCode가 없는 경우, 기존 content를 그대로 사용
          existingContent.content['application/json'].examples =
            mergeExampleObject(
              ...[
                existingContent['application/json']?.examples,
                newContent.content['application/json'].examples,
              ],
            );
        } else {
          setApiResponseContent(
            {
              ...groupedMetadata,
              ...apiResponses,
            },
            descriptor,
          );
        }
      }
      const model = getApiModel(descriptor);

      if (!model) {
        Reflect.defineMetadata(
          DECORATORS.API_EXTRA_MODELS,
          [HttpBaseException],
          descriptor.value,
        );
      }
      return descriptor;
    } else {
      applyClassDecorator(target, options);
    }

    return target;
  };
}

const applyClassDecorator = (target: any, exceptions: ApiErrorOptions[]) => {
  for (const key of Object.getOwnPropertyNames(target.prototype)) {
    const methodDescriptor = Object.getOwnPropertyDescriptor(
      target.prototype,
      key,
    );

    const decorator = ApiError(...exceptions);
    decorator(target, key, methodDescriptor!);
  }
};

function getApiResponseContent(
  descriptor: TypedPropertyDescriptor<any>,
): GroupedMetadata {
  return Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value);
}

function setApiResponseContent(
  content: GroupedMetadata,
  descriptor: TypedPropertyDescriptor<any>,
) {
  Reflect.defineMetadata(DECORATORS.API_RESPONSE, content, descriptor.value);
}

function getApiModel(descriptor: TypedPropertyDescriptor<any>) {
  return Reflect.getMetadata(DECORATORS.API_EXTRA_MODELS, descriptor.value);
}

function mergeExampleObject(...examples: ExamplesObject[]): ExamplesObject {
  return examples.reduce((merged, current) => {
    return { ...merged, ...current };
  }, {});
}
