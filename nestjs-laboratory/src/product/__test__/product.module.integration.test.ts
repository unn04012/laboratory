import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { ConfigModule } from '../../config/config.module';
import { MySQLConfig } from '../../config/config.mysql';
import { dataSourceFactory, dataSourceOptionsFactory } from '../../infrastructure/typeorm-factory';
import { ProductController } from '../product.controller';
import { ProductModule } from '../product.module';
import { ProductService } from '../product.service';
import { OrderRepository } from '../repository/order.repository';
import { ProductRepository } from '../repository/product.repository';

function mockMysqlConfigFactory({ user, password, database, port, host }): MySQLConfig {
  return <MySQLConfig>{
    user,
    password,
    database,
    port,
    connectionLimit: 5,
    host,
  };
}

async function initMysql() {
  return await new MySqlContainer().withUsername('user').withUserPassword('password').withDatabase('database').start();
}
describe('productModule 통합 테스트를 위한 테스트', () => {
  let mysqlContainer: StartedMySqlContainer;
  let mysqlConfig: MySQLConfig;

  beforeAll(async () => {
    mysqlContainer = await initMysql();

    const port = mysqlContainer.getPort();
    const host = mysqlContainer.getHost();
    const user = mysqlContainer.getUsername();
    const database = mysqlContainer.getDatabase();
    const password = mysqlContainer.getUserPassword();

    const mockMysqlConfig = mockMysqlConfigFactory({ port, host, user, database, password });

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [MySQLConfig],
          useFactory: dataSourceOptionsFactory,
          dataSourceFactory: dataSourceFactory,
        }),
        ProductModule,
      ],
      // controllers: [ProductController],
      // providers: [ProductService, ProductRepository, OrderRepository],
    })
      .overrideProvider(MySQLConfig)
      .useValue(mockMysqlConfig)
      .compile();

    mysqlConfig = app.get(MySQLConfig);
  });

  afterAll(async () => {
    await mysqlContainer.stop();
  });

  test('mysql conatiner가 성공적으로 띄어져야 한다.', async () => {
    const { user, password, database } = mysqlConfig;

    // const container = await new MySqlContainer().withUsername(user).withUserPassword(password).withDatabase(database).start();
    // console.log(container.getPort());

    expect(mysqlContainer.getConnectionUri()).toEqual(
      `mysql://${user}:${password}@${mysqlContainer.getHost()}:${mysqlContainer.getPort()}/${database}`,
    );

    // await container.stop();
  });
});
