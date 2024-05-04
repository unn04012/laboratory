import { Inject, Injectable } from '@nestjs/common';
import { Symbols } from '../symbols';
import { IConfigReader } from './config-reader.interface';

@Injectable()
export class MySQLConfig {
  private _host: string;
  private _port: number;
  private _database: string;
  private _user: string;
  private _password: string;
  private _connectionLimit: number;

  constructor(@Inject(Symbols.configReader) reader: IConfigReader) {
    this._host = reader.read('MYSQL_HOST');
    this._port = Number(reader.readOptional('MYSQL_PORT', '3306'));
    this._database = reader.read('MYSQL_DATABASE');
    this._user = reader.read('MYSQL_USER');
    this._password = reader.read('MYSQL_PASSWORD');
    this._connectionLimit = Number(reader.readOptional('MYSQL_CONNECTION_LIMIT', '5'));
  }

  public get host() {
    return this._host;
  }
  public get port() {
    return this._port;
  }
  public get database() {
    return this._database;
  }
  public get user() {
    return this._user;
  }
  public get password() {
    return this._password;
  }
  public get connectionLimit() {
    return this._connectionLimit;
  }
}
