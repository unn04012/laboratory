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
    const statusCode = option.status || '400';

    acc[statusCode] = {
      content: {
        'application/json': {
          examples: {}, // 적절한 examples 객체
          schema: {
            oneOf: [], // 적절한 schema 배열
          },
        },
      },
      type: undefined,
      isArray: undefined,
      description: option.description || '',
    };

    return acc;
  }, {} as GroupedMetadata); // 초기값 제공

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
      console.log(apiResponses, extraModels);
      return descriptor;
    }
    return target;
  };
}
function omit(options: ApiErrorOptions[], arg1: string) {
  throw new Error('Function not implemented.');
}
