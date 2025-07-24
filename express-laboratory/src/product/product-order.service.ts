import { nanoid } from 'nanoid';
import { OptimisticLockVersionMismatchError } from 'typeorm';
import { getDataSource } from '../typeorm/connection-factory';
import { OrderRepository } from './order.repository';
import { ProductRepository } from './product.repository';
import { NotFoundProductOrder, ProductNotRemainStock } from './proudct-order.errors';

export class ProductOrderService {
  constructor(private readonly _productRepository: ProductRepository, private readonly _orderRepository: OrderRepository) {}

  public async getProducts() {
    await this._productRepository.sleep(10);
    return await this._productRepository.findOneBy().id(1);
  }

  public async order(productId: number, userId: string) {
    return await getDataSource().transaction('SERIALIZABLE', async (mgr) => {
      const product = await this._productRepository.findOneBy(mgr).id(productId);
      if (!product) throw new NotFoundProductOrder('not found product');

      if (product.remainStock <= 0) throw new ProductNotRemainStock(`cannot buy product, remainStock: ${product.receiveStock}`);

      await this._productRepository.updatePartialById(productId, { remainStock: product.remainStock - 1 }, mgr);

      const order = await this._orderRepository.createOrder({ productId, userId, orderId: nanoid(), count: 1 }, mgr);

      return order;
    });
  }

  public async orderWithPemesssticLock(productId: number, userId: string) {
    const qr = getDataSource().createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const product = await (await this._productRepository.findOneQueryBuilderBy(qr)).id(productId, 'pessimistic_write');
      if (!product) throw new NotFoundProductOrder('not found product');

      if (product.remainStock <= 0) throw new ProductNotRemainStock(`cannot buy product, remainStock: ${product.remainStock}`);

      await this._productRepository.updateBy(qr).idOfRemainStock(productId, product.remainStock - 1);
      await this._orderRepository.createOrderWithQr({ productId, userId, orderId: nanoid(), count: 1 }, qr);

      await qr.commitTransaction();
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  public async orderWithOptimisticLock(productId: number, userId: string) {
    return await getDataSource().transaction(async (mgr) => {
      const product = await this._productRepository.findOneBy(mgr).id(productId);
      if (!product) throw new NotFoundProductOrder('not found product');

      if (product.remainStock <= 0) throw new ProductNotRemainStock(`cannot buy product, remainStock: ${product.remainStock}`);

      const updatedProduct = {
        ...product,
        remainStock: product.remainStock - 1,
      };

      await this._productRepository.updateBySchemaWithOptimisticLock(updatedProduct, mgr);

      const order = await this._orderRepository.createOrder({ productId, userId, orderId: nanoid(), count: 1 }, mgr);

      return order;
    });
  }
}
