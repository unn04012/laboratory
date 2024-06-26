import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponse } from '../common/decorators/decorators';
import { NotFoundInventory, NotFoundProduct } from '../common/errors';
import { ProductService } from './product.service';

@Controller('product')
@ApiErrorResponse(400, {
  type: NotFoundProduct,
  description: '상품이 없습니다',
  errorCode: 'NOT_FOUND_PRODUCT',
})
export class ProductController {
  constructor(private readonly _productService: ProductService) {}

  @Get('/:id')
  @ApiOperation({ summary: '상품 조회' })
  @ApiErrorResponse(400, {
    type: NotFoundInventory,
    description: '재고가 없습니다',
    errorCode: 'NOT_FOUND_INVENTORY',
  })
  public async findProduct(@Param('id') productId: string) {
    return await this._productService.findProduct(Number(productId));
  }

  @Post('/:id')
  @ApiErrorResponse(404, {
    type: NotFoundInventory,
    description: '재고가 없습니다',
    errorCode: 'NOT_FOUND_INVENTORY',
  })
  @ApiOperation({ summary: '상품 생성' })
  public async postProduct(@Param('id') productId: string) {
    return await this._productService.findProduct(Number(productId));
  }
}
