import { ConfigReader } from './config-reader';
import { MysqlConfig } from './config.mysql';

const instances: {
  mysqlConfig: MysqlConfig | null;
} = {
  mysqlConfig: null,
};

export function initConfigModule() {
  const configReader = new ConfigReader();

  const mysqlConfig = new MysqlConfig(configReader);

  instances.mysqlConfig = mysqlConfig;
}

export function getConfigModule(config: keyof typeof instances) {
  const found = instances[config];
  if (!found) throw new Error(`not found config module, config: ${config}`);

  return found;
}
