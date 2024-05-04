import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';

@Injectable()
export class ProductService {
  constructor(@Inject(ProductRepository) private readonly _productRepository: ProductRepository) {}

  public async findProduct(productId: number) {
    const product = await this._productRepository.findOneBy().id(productId);

    return product;
  }
}
