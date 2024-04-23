import { OrderSchema } from './schemas/order-schema';
import { ProductSchema } from './schemas/product-schema';
import { getDataSource } from './typeorm/connection-factory';
import { OrderRepository } from './product/order.repository';
import { ProductRepository } from './product/product.repository';

const instances: {
  product: ProductRepository | null;
  order: OrderRepository | null;
} = {
  product: null,
  order: null,
};

export function initRepositores() {
  const conn = getDataSource();

  instances.product = new ProductRepository(conn.getRepository(ProductSchema));
  instances.order = new OrderRepository(conn.getRepository(OrderSchema));
}

export function getRepository() {
  return {
    product: () => {
      const repo = instances.product;
      if (!repo) throw new Error();

      return repo;
    },
    order: () => {
      const repo = instances.order;
      if (!repo) throw new Error();

      return repo;
    },
  };
}
