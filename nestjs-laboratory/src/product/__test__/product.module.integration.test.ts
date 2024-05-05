import supertest from 'supertest';

import { Test } from '@nestjs/testing';
import { StartedMySqlContainer } from '@testcontainers/mysql';
import { ConfigModule } from '../../config/config.module';
import { MySQLConfig } from '../../config/config.mysql';
import { ProductModule } from '../product.module';
import { INestApplication } from '@nestjs/common';
import { initMysqlContainer, mockMysqlConfigFactory, MockTypeormModule } from '../../test/mysql-environment';

describe('productModule 통합 테스트를 위한 테스트', () => {
  let mysqlContainer: StartedMySqlContainer;
  let mysqlConfig: MySQLConfig;
  let app: INestApplication;

  beforeAll(async () => {
    mysqlContainer = await initMysqlContainer();

    const port = mysqlContainer.getPort();
    const host = mysqlContainer.getHost();
    const user = mysqlContainer.getUsername();
    const database = mysqlContainer.getDatabase();
    const password = mysqlContainer.getUserPassword();

    const mockMysqlConfig = mockMysqlConfigFactory({ port, host, user, database, password });

    const module = await Test.createTestingModule({
      imports: [ConfigModule, MockTypeormModule(), ProductModule],
    })
      .overrideProvider(MySQLConfig)
      .useValue(mockMysqlConfig)
      .compile();

    mysqlConfig = module.get(MySQLConfig);

    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await mysqlContainer.stop();
  });

  test('mysql conatiner가 성공적으로 띄어져야 한다.', async () => {
    const { user, password, database } = mysqlConfig;

    expect(mysqlContainer.getConnectionUri()).toEqual(
      `mysql://${user}:${password}@${mysqlContainer.getHost()}:${mysqlContainer.getPort()}/${database}`,
    );
  });

  test('GET /product/:id', async () => {
    const response = await supertest(app.getHttpServer()).get('/product/1').expect(200);

    expect(response.body).toMatchObject({});
  });
});
