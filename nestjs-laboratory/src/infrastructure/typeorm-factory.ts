import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { MySQLConfig } from '../config/config.mysql';

import { ProductSchema } from '../product/schemas/product.schema';
import { OrderSchema } from '../product/schemas/order.schema';

export async function dataSourceFactory(options: DataSourceOptions): Promise<DataSource> {
  const initialized = await new DataSource(options).initialize();
  await inspectConnection(initialized);

  //   return addTransactionalDataSource(initialized);
  return initialized;
}

export function getAllTypeOrmModels() {
  return [ProductSchema, OrderSchema];
}

export function dataSourceOptionsFactory(config: MySQLConfig): DataSourceOptions {
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
    entities: getAllTypeOrmModels(),
    namingStrategy: new SnakeNamingStrategy(),
    logging: true,
  };
}

async function inspectConnection(datasource: DataSource) {
  await datasource.query('SELECT 1');
}
