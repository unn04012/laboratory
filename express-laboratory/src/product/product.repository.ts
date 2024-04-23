import { EntityManager, Repository } from 'typeorm';
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

  private _getRepo(mgr?: EntityManager) {
    return mgr ? mgr.getRepository(ProductSchema) : this._repo;
  }
}
