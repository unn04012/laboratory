import { Controller, Get, Param } from '@nestjs/common';
import { ApiErrorResponse, ApiErrorResponseV2 } from '../common/decorators';
import { NotFoundInventory, NotFoundProduct } from '../common/errors';
import { ProductService } from './product.service';

@Controller('product')
@ApiErrorResponseV2(400, {
  type: NotFoundProduct,
  description: '상품이 없습니다',
  errorCode: 'NOT_FOUND_PRODUCT',
})
export class ProductController {
  constructor(private readonly _productService: ProductService) {}

  @Get('/:id')
  @ApiErrorResponseV2(400, {
    type: NotFoundInventory,
    description: '재고가 없습니다',
    errorCode: 'NOT_FOUND_INVENTORY',
  })
  public async findProduct(@Param('id') productId: string) {
    return await this._productService.findProduct(Number(productId));
  }
}
