import { nanoid } from 'nanoid';
import { getConfigModule, initConfigModule } from '../src/config';
import { OrderSchema } from '../src/schemas/order-schema';
import { ProductSchema } from '../src/schemas/product-schema';
import { dataSourceFactory, getDataSource } from '../src/typeorm/connection-factory';

(async () => {
  initConfigModule();
  await dataSourceFactory(getConfigModule('mysqlConfig'));

  const conn = getDataSource();

  await conn.transaction(async (mgr) => {
    const productRepo = mgr.getRepository(ProductSchema);
    const orderRepo = mgr.getRepository(OrderSchema);

    const products: ProductSchema[] = [];

    // 500개의 상품 생성
    for (let i = 0; i < 500; i++) {
      const product = productRepo.create({ name: `상품${i + 1}`, receiveStock: 1000, remainStock: 1000 });
      products.push(product);
    }

    await productRepo.insert(products);

    const order = orderRepo.create({ orderId: nanoid(), productId: 1, count: 3 });

    await orderRepo.insert(order);

    await productRepo.update({ id: 1 }, { remainStock: 997 });
  });
})();
