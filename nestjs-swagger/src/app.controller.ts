import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import {
  NotFoundException,
  NotFoundProduct,
  NotFoundUser,
} from 'src/exceptions/not-found-exception';
import { HttpBaseException } from 'src/exceptions/http-base-exception';
import { ApiError } from './swagger/decorators/api-error.decorator';

@Controller()
@ApiError({ error: NotFoundUser, status: 400 })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(HttpBaseException),
        },
        examples: {
          // 여기가 핵심!
          validationError: {
            summary: 'Validation Error',
            description: '유효성 검사 실패 예시',
            value: {
              statusCode: 400,
              code: 'VALIDATION_ERROR',
              message: '이메일 형식이 올바르지 않습니다.',
            },
          },
          missingField: {
            summary: 'Missing Field',
            description: '필수 필드 누락 예시',
            value: {
              statusCode: 400,
              code: 'MISSING_FIELD',
              message: 'name 필드는 필수입니다.',
            },
          },
          invalidFormat: {
            summary: 'Invalid Format',
            description: '잘못된 형식 예시',
            value: {
              statusCode: 400,
              code: 'INVALID_FORMAT',
              message: '전화번호 형식이 올바르지 않습니다.',
            },
          },
        },
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api')
  @ApiError(
    {
      error: NotFoundProduct,
      description: '상품을 찾을 수 없을 때',
      status: 400,
    },
    {
      error: NotFoundUser,
      description: '사용자를 찾을 수 없을 때',
    },
  )
  getSwaggerExample(): any {
    return this.appService.getHello();
  }
}
