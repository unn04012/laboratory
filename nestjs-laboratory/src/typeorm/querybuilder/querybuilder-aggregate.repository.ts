import { InjectRepository } from '@nestjs/typeorm';

import { OrderSchema } from '../../product/schemas/order.schema';
import { EntityManager, Repository } from 'typeorm';
import { OrderRepository } from '../../product/repository/order.repository';

type CountByProduct = {
  productId: number;
  count: string;
};

export class QueryBuilderAggregateRepository {
  constructor(@InjectRepository(OrderSchema) private readonly _orderRepository: Repository<OrderSchema>) {}

  public async getOrderCountByProductId(): Promise<CountByProduct[]> {
    const qb = this._orderRepository
      .createQueryBuilder('order')
      .select('order.product_id', 'productId')
      .addSelect('COUNT(product_id)', 'count')
      .groupBy('order.product_id');

    const productCount = await qb.getRawMany<{ productId: number; count: string }>();

    return productCount;
  }

  public async paginationWithAggregateFunction(skip: number = 0, take: number = 0) {
    const qb = this._orderRepository
      .createQueryBuilder('order')
      .select('order.product_id', 'productId')
      .addSelect('COUNT(product_id)', 'count')
      .groupBy('order.product_id');

    const count = await qb.getCount();

    if (skip >= 0 && take) {
      qb.skip(skip).take(take);
    }

    const paginated = await qb.getRawMany<{ productId: number; count: string }>();

    return { count, paginated };
  }
}
