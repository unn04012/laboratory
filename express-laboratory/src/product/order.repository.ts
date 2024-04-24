import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { OrderSchema } from '../schemas/order-schema';
import { ProductSchema } from '../schemas/product-schema';

export type CreateOrderParam = {
  userId: string;
  orderId: string;
  productId: number;
  count: number;
};

export class OrderRepository {
  constructor(private readonly _repo: Repository<OrderSchema>) {}

  public async createOrder(param: CreateOrderParam, mgr?: EntityManager) {
    const repo = this._getRepo(mgr);
    const created = await repo.save(param);
    return created;
  }

  public async createOrderWithQr(param: CreateOrderParam, qr?: QueryRunner) {
    const repo = this._getRepo();

    const qb = repo.createQueryBuilder('order', qr);

    await qb.insert().into(OrderSchema).values(param).execute();
  }

  private _getRepo(mgr?: EntityManager) {
    return mgr ? mgr.getRepository(OrderSchema) : this._repo;
  }
}
