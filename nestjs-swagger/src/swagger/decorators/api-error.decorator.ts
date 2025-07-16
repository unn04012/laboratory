import { getSchemaPath } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import {
  ExamplesObject,
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { HttpBaseException } from 'exceptions/http-base-exception';

export type ApiErrorOptions = {
  summary?: string;
  description?: string;
  status?: string;
  error: new (...args: any[]) => HttpBaseException;
};

type GroupedMetadata = {
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

export function ApiError(
  ...options: ApiErrorOptions[]
): ClassDecorator & MethodDecorator {
  const groupedMetadata: GroupedMetadata = options.reduce((acc, option) => {
    const statusCode = Number(option.status || '400');

    // 기존 항목이 없으면 초기화
    if (!acc[statusCode]) {
      acc[statusCode] = {
        content: {
          'application/json': {
            schema: {
              oneOf: [],
            },
            examples: {},
          },
        },
        type: undefined,
        isArray: undefined,
        description: option.description || '',
      };
    }

    // schema에 error 타입 추가 (중복 방지)
    // const existingSchema =
    //   acc[statusCode].content['application/json'].schema.oneOf;
    // if (!existingSchema.includes(option.error)) {
    //   existingSchema.push(option.error);
    // }

    // examples에 새로운 예시 추가
    if (option.error.name) {
      const instance = new option.error('Example error message');

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

  console.log(JSON.stringify(groupedMetadata));
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor) {
      const apiResponses = Reflect.getMetadata(
        DECORATORS.API_RESPONSE,
        descriptor.value,
      );

      const extraModels = Reflect.getMetadata(
        DECORATORS.API_EXTRA_MODELS,
        descriptor.value,
      );

      //   console.log(descriptor.value);

      return descriptor;
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
