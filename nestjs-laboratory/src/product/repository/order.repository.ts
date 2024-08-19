import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { OrderSchema } from '../schemas/order.schema';

export type CreateOrderParam = {
  userId: string;
  productId: number;
  count: number;
  orderId: string;
};

@Injectable()
export class OrderRepository {
  constructor(@InjectRepository(OrderSchema) private readonly _repo: Repository<OrderSchema>) {}

  public async createOrder(param: CreateOrderParam, mgr?: EntityManager) {
    const created = await this._repo.save(param);
    return created;
  }

  public async createOrderWithQr(param: CreateOrderParam, qr?: QueryRunner) {
    const qb = this._repo.createQueryBuilder('order', qr);

    await qb.insert().into(OrderSchema).values(param).execute();
  }
}
