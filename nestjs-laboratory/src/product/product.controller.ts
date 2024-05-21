import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiErrorResponse } from '../common/decorators';
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
  @ApiErrorResponse(
    400,
    {
      type: NotFoundInventory,
      description: '재고가 없습니다',
      errorCode: 'NOT_FOUND_INVENTORY',
    },
    // {
    //   type: NotFoundProduct,
    //   description: '상품이 없습니다',
    //   errorCode: 'NOT_FOUND_PRODUCT',
    // },
  )
  public async findProduct(@Param('id') productId: string) {
    return await this._productService.findProduct(Number(productId));
  }

  // @Post('/:id')
  // public async updateProduct(@Param('id') productId: string) {
  //   return await this._productService.findProduct(Number(productId));
  // }
}
