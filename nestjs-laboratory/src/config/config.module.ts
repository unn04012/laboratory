import { Module } from '@nestjs/common';
import { Symbols } from '../symbols';
import { ConfigReader } from './config-reader';
import { MySQLConfig } from './config.mysql';

@Module({
  providers: [
    {
      provide: Symbols.configReader,
      useClass: ConfigReader,
    },
    MySQLConfig,
  ],
  exports: [MySQLConfig],
})
export class ConfigModule {}
