import { getSchemaPath } from '@nestjs/swagger';
import { ExamplesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpBaseException } from 'exceptions/http-base-exception';

/**
 * extraModel과 getSchemaPath를 동시에 등록하는 파라미터를 제공합니다.
 * @param dtos
 * @returns
 * getSchemaPath를 사용하여 Swagger 문서에 모델을 등록합니다.
 */
export function makeSchemaPath(dtos: any[]): any[] {
  if (Array.isArray(dtos)) {
    return dtos.map((e) => ({ $ref: getSchemaPath(e) }));
  } else {
    return [
      {
        $ref: getSchemaPath(dtos),
      },
    ];
  }
}

// export function makeErrorResponseExample(
//   errors: HttpBaseException | HttpBaseException[],
// ): ExamplesObject {
//   type ErrorMessage = {
//     message: string;
//     path: string;
//     method: string;
//   };
//   const errorMessage: ErrorMessage = {
//     message: 'string',
//     path: 'api path',
//     method: 'http method',
//   };

//   if (Array.isArray(errors)) {
//   }
// }
