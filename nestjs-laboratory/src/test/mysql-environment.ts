import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySqlContainer } from '@testcontainers/mysql';
import { DataSourceOptions, EntitySchema } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule } from '../config/config.module';
import { MySQLConfig } from '../config/config.mysql';
import { dataSourceFactory } from '../infrastructure/typeorm-factory';
import { OrderSchema } from '../product/schemas/order.schema';
import { ProductSchema } from '../product/schemas/product.schema';

export async function initMysqlContainer() {
  return await new MySqlContainer().withUsername('user').withUserPassword('password').withDatabase('database').withExposedPorts(3306).start();
}

export function mockDataSourceOptionsFactory(config: MySQLConfig): DataSourceOptions {
  const { host, port, user, password, database, connectionLimit } = config;
  return {
    type: 'mysql',
    timezone: '+00:00',
    extra: {
      decimalNumbers: true,
    }, // for mysql2 driver
    host,
    port,
    username: user,
    password,
    database,
    poolSize: connectionLimit,
    synchronize: true,
    entities: [ProductSchema, OrderSchema],
    namingStrategy: new SnakeNamingStrategy(),
    logging: false,
  };
}

export function mockMysqlConfigFactory({ user, password, database, port, host }): MySQLConfig {
  return <MySQLConfig>{
    user,
    password,
    database,
    port,
    connectionLimit: 5,
    host,
  };
}

export function MockTypeormModule(): DynamicModule {
  return TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [MySQLConfig],
    useFactory: mockDataSourceOptionsFactory,
    dataSourceFactory: dataSourceFactory,
  });
}
