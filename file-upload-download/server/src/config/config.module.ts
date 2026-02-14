import { EnvConfigReader } from './env-config-reader';
import { S3Config } from './aws.config';
import { IConfigReader } from './interfaces/config-reader.interface';

const instances: {
  configReader: IConfigReader | null;
  s3Config: S3Config | null;
} = {
  configReader: null,
  s3Config: null,
};

export function initConfigModule(): void {
  if (instances.configReader) return;

  instances.configReader = new EnvConfigReader();
  instances.s3Config = new S3Config(instances.configReader);
}

export function getConfigReader(): IConfigReader {
  if (!instances.configReader) {
    throw new Error('ConfigModule is not initialized. Call initConfigModule() first.');
  }
  return instances.configReader;
}

export function getS3Config(): S3Config {
  if (!instances.s3Config) {
    throw new Error('ConfigModule is not initialized. Call initConfigModule() first.');
  }
  return instances.s3Config;
}
