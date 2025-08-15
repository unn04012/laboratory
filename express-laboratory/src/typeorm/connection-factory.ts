import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { MysqlConfig } from '../config/config.mysql';
import { OrderSchema } from '../schemas/order-schema';
import { ProductSchema } from '../schemas/product-schema';
import { AppEnvironmentEntity } from '../single-table-inheritance/schema/app-environment.schema';
import { WebEnvironmentEntity } from '../single-table-inheritance/schema/web-environment.schema';
import { RefEnvironmentEntity } from '../single-table-inheritance/schema/environment.schema';
import { InquiryEntity } from '../single-table-inheritance/schema/inquiry.schema';

let connection: DataSource | null = null;

export async function dataSourceFactory(config: MysqlConfig) {
  const { connectionLimit, database, host, password, user } = config;
  console.log(`connection limit: ${connectionLimit}, database: ${database}, host: ${host}, user: ${user}`);
  const dataSource = new DataSource({
    type: 'mysql',
    host,
    port: 3306,
    username: user,
    password,
    database,
    synchronize: false,
    logging: true,
    entities: [AppEnvironmentEntity, WebEnvironmentEntity, RefEnvironmentEntity, InquiryEntity],
    poolSize: 30,
    // extra: {
    //   connectionLimit: 30,
    //   maxIdle: 30,
    // },

    namingStrategy: new SnakeNamingStrategy(),
  });

  connection = await dataSource.initialize();
  console.log(`database connection successfully, host: ${host}, user: ${user}`);
}

export function getDataSource() {
  if (!connection) throw new Error('not found connection');
  return connection;
}
