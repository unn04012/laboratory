import { Inject, Injectable } from '@nestjs/common';
import { Symbols } from '../symbols';
import { IConfigReader } from './config-reader.interface';

@Injectable()
export class RedisConfig {
  private _port: number;
  private _host: string;

  constructor(@Inject(Symbols.configReader) readonly reader: IConfigReader) {
    this._port = Number(reader.read('REDIS_PORT'));
    this._host = reader.read('REDIS_HOST');
  }

  public get port() {
    return this._port;
  }

  public get host() {
    return this._host;
  }
}
