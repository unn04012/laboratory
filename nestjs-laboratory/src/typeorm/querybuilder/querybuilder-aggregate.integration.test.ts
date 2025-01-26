import { Test } from '@nestjs/testing';
import { QueryBuilderAggregateRepository } from './querybuilder-aggregate.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { MySQLConfig } from '../../config/config.mysql';
import { dataSourceFactory, dataSourceOptionsFactory } from '../../infrastructure/typeorm-factory';
import { OrderSchema } from '../../product/schemas/order.schema';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

describe('typeorm queryBuilder test', () => {
  let repo: QueryBuilderAggregateRepository;
  let connection: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext();

    const moduleRef = await Test.createTestingModule({
      providers: [QueryBuilderAggregateRepository],
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [MySQLConfig],
          useFactory: dataSourceOptionsFactory,
          dataSourceFactory,
        }),
        TypeOrmModule.forFeature([OrderSchema]),
      ],
    }).compile();

    repo = moduleRef.get(QueryBuilderAggregateRepository);
    connection = moduleRef.get(DataSource);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('집계함수 사용시 raw type은 string타입이다', async () => {
    const count = await repo.getOrderCountByProductId();

    expect(typeof count[0].count).toMatch('string');
  });
});
