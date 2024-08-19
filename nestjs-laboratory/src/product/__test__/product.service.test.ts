import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { v4 } from 'uuid';
import { ConfigModule } from '../../config/config.module';
import { MySQLConfig } from '../../config/config.mysql';
import { dataSourceFactory, dataSourceOptionsFactory } from '../../infrastructure/typeorm-factory';
import { ProductModule } from '../product.module';
import { ProductService } from '../product.service';

describe('ProductService', () => {
  let service: ProductService;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProductModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [MySQLConfig],
          useFactory: dataSourceOptionsFactory,
          dataSourceFactory: dataSourceFactory,
        }),
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    dataSource = module.get(DataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });

  test('재고가 10개있는 상품을 동시에 10개 주문 후에는 제고가 0이 되어야 한다.', async () => {
    const product = await service.createProduct({ productName: '상품1', receiveStock: 10 });

    const userId = v4();
    const ORDER_COUNT = 1;

    await Promise.all([
      service.orderProduct(userId, product.id, ORDER_COUNT),
      service.orderProduct(userId, product.id, ORDER_COUNT),
      service.orderProduct(userId, product.id, ORDER_COUNT),
      service.orderProduct(userId, product.id, ORDER_COUNT),
      service.orderProduct(userId, product.id, ORDER_COUNT),
      service.orderProduct(userId, product.id, ORDER_COUNT),
      service.orderProduct(userId, product.id, ORDER_COUNT),
      service.orderProduct(userId, product.id, ORDER_COUNT),
      service.orderProduct(userId, product.id, ORDER_COUNT),
      service.orderProduct(userId, product.id, ORDER_COUNT),
    ]);

    const afterProduct = await service.findProduct(product.id);

    expect(afterProduct?.remainStock).toBe(0);
  });
});
