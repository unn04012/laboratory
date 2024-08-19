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

  public async createProduct({ name, remainStock, receiveStock }: CreateProduct) {
    const entity = this._repo.create({ name, remainStock, receiveStock });
    return await this._repo.save(entity);
  }

  public findOneBy(lock?: boolean) {
    const repo = this._repo;
    return {
      async id(productId: number) {
        const qb = repo.createQueryBuilder();

        qb.where('id =:productId', { productId });

        if (lock) qb.setLock('pessimistic_write');

        return qb.getOne();
      },
    };
  }

  public async updatePartialById(id: number, partial: Partial<ProductSchema>) {
    const entity = this._repo.create({ id, ...partial });

    await this._repo.save(entity);
  }

  public async decreateProductInventory(productId: number, orderCount: number) {
    await this._repo
      .createQueryBuilder()
      .update()
      .set({ remainStock: () => `remain_stock - :orderCount` })
      .where('id = :productId', { orderCount, productId })
      .execute();
  }
}
