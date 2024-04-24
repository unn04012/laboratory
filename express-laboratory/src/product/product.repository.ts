import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { ProductSchema } from '../schemas/product-schema';

export class ProductRepository {
  constructor(private readonly _repo: Repository<ProductSchema>) {}

  public findOneBy(mgr?: EntityManager) {
    const repo = this._getRepo(mgr);
    return {
      async id(productId: number) {
        const found = await repo.findOne({ where: { id: productId } });

        return found;
      },
    };
  }

  public async updatePartialById(id: number, partial: Partial<ProductSchema>, mgr?: EntityManager) {
    const repo = this._getRepo(mgr);

    await repo.update({ id }, partial);
  }

  public async findOneQueryBuilderBy(queryRunner?: QueryRunner) {
    const repo = this._getRepo();
    const qr = repo.createQueryBuilder('product', queryRunner);

    return {
      async id(productId: number, lock?: 'pessimistic_read' | 'pessimistic_write') {
        const found = qr.where('id =:productId', { productId });

        if (lock) qr.setLock(lock);

        return await found.getOne();
      },
    };
  }

  public updateBy(queryRunner?: QueryRunner) {
    const repo = this._getRepo();
    const qr = repo.createQueryBuilder('product', queryRunner);

    return {
      async idOfRemainStock(productId: number, remainStock: number) {
        await qr.update().set({ remainStock }).where('id =:productId', { productId }).execute();
      },
    };
  }

  private _getRepo(mgr?: EntityManager) {
    return mgr ? mgr.getRepository(ProductSchema) : this._repo;
  }
}
