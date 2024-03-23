import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { MysqlConfig } from '../config/config.mysql';
import { TitlesEntity } from '../schemas/titles';

let connection: DataSource | null = null;

export async function dataSourceFactory(config: MysqlConfig) {
  const { connectionLimit, database, host, password, user } = config;
  const dataSource = new DataSource({
    type: 'mysql',
    host,
    port: 3306,
    username: user,
    password,
    database,
    synchronize: false,
    logging: true,
    entities: [TitlesEntity],
    poolSize: connectionLimit,
    namingStrategy: new SnakeNamingStrategy(),
  });

  connection = await dataSource.initialize();
  console.log(`database connection successfully, host: ${host}, user: ${user}`);
}

export function getDataSource() {
  if (!connection) throw new Error('not found connection');
  return connection;
}
