import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly _productService: ProductService) {}

  @Get('/:id')
  public async findProduct(@Param('product') productId: string) {
    return await this._productService.findProduct(Number(productId));
  }
}
