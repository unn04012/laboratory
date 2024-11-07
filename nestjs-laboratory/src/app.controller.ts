import { Controller, Get } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiErrorResponse } from './common/decorators/decorators';
import { NotFoundInventory, NotFoundProduct } from './common/errors';

export class ClassDto {
  @ApiProperty()
  classId: number;
}
export class MethodDto {
  @ApiProperty()
  methodId: number;
}

@Controller()
@ApiErrorResponse(400, {
  type: NotFoundProduct,
  description: '상품이 없습니다',
  errorCode: 'NOT_FOUND_PRODUCT',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiErrorResponse(400, {
    type: NotFoundInventory,
    description: '재고가 없습니다',
    errorCode: 'NOT_FOUND_INVENTORY',
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/v2')
  getHelloV2(): string {
    return this.appService.getHello();
  }
}
