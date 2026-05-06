import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { UserEntity } from '../entities/user.entity';
import { OrderEntity } from '../entities/order.entity';

export function getAllEntities() {
  return [UserEntity, OrderEntity];
}

export function dataSourceOptionsFactory(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'postgres',
    schema: process.env.DB_SCHEMA ?? 'public',
    poolSize: Number(process.env.DB_POOL_SIZE ?? 10),
    extra: {
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 30_000,
      statement_timeout: 30_000,
    },
    synchronize: false,
    entities: getAllEntities(),
    namingStrategy: new SnakeNamingStrategy(),
    logging: process.env.DB_LOGGING === 'true',
  };
}

export async function dataSourceFactory(
  options?: DataSourceOptions,
): Promise<DataSource> {
  if (!options) {
    throw new Error('DataSourceOptions is required');
  }
  const datasource = await new DataSource(options).initialize();
  await datasource.query('SELECT 1');
  return datasource;
}
