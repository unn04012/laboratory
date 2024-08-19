import Redis from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { IsolationLevel, Transactional } from 'typeorm-transactional';
import { NotFoundInventory, NotFoundProduct } from '../common/errors';
import { Symbols } from '../symbols';
import { OrderRepository } from './repository/order.repository';
import { ProductRepository } from './repository/product.repository';
import { DataSource, Transaction } from 'typeorm';
import { ProductSchema } from './schemas/product.schema';
import { OrderSchema } from './schemas/order.schema';

@Injectable()
export class ProductService {
  constructor(
    @Inject(ProductRepository) private readonly _productRepository: ProductRepository,
    @Inject(OrderRepository) private readonly _orderRepository: OrderRepository, // @Inject(Symbols.redisClient) private readonly _redisClient: Redis,
    @Inject(DataSource) private readonly _dataSource: DataSource,
  ) {}

  public async findProduct(productId: number) {
    const product = await this._productRepository.findOneBy().id(productId);

    return product;
  }

  public async createProduct({ productName, receiveStock }: { productName: string; receiveStock: number }) {
    const created = await this._productRepository.createProduct({ name: productName, receiveStock, remainStock: receiveStock });

    return created;
  }

  @Transactional()
  public async orderProduct(userId: string, productId: number, orderCount: number) {
    const product = await this._productRepository.findOneBy(true).id(productId);
    if (!product) throw new NotFoundProduct(`not found product, productId: ${productId}`);

    if (product.remainStock < 0) throw new NotFoundInventory(`product inventory not found`);

    await this._orderRepository.createOrder({ userId, productId, count: orderCount, orderId: nanoid() });
    await this._productRepository.decreateProductInventory(productId, orderCount);
  }

  public async orderProductWithLock(userId: string, productId: number, orderCount: number) {
    const qr = this._dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();
    const productRepo = qr.manager.getRepository(ProductSchema);
    const orderRepo = qr.manager.getRepository(OrderSchema);

    try {
      const qb = productRepo.createQueryBuilder('product', qr);
      const product = await qb.where(`id =:productId`, { productId }).getOne();

      if (!product) throw new NotFoundProduct(`not found product, productId: ${productId}`);

      if (product.remainStock < 0) throw new NotFoundInventory(`product inventory not found`);

      const order = new OrderSchema();
      order.userId = userId;
      order.count = orderCount;
      order.orderId = nanoid();
      order.productId = productId;
      await orderRepo.save(order);

      await productRepo.update({ id: productId }, { remainStock: () => `remain_stock - ${orderCount}` });

      await qr.commitTransaction();
    } catch (err) {
      await qr.rollbackTransaction();
    } finally {
      await qr.release();
    }
  }
}
