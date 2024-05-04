import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSchema } from '../schemas/product.schema';

export type CreateProduct = {
  name: string;
  receiveStock: number;
  remainStock: number;
};

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(ProductSchema) private readonly _repo: Repository<ProductSchema>) {}

  public async createProduct(param: CreateProduct) {
    await this._repo.save(param);
  }

  public findOneBy() {
    const repo = this._repo;
    return {
      async id(productId: number) {
        const found = await repo.findOne({ where: { id: productId } });

        return found;
      },
    };
  }

  public async updatePartialById(id: number, partial: Partial<ProductSchema>) {
    const entity = this._repo.create({ id, ...partial });

    await this._repo.save(entity);
  }
}
