import { IConfigReader } from './config-reader.interface';

export class MysqlConfig {
  private readonly _connectionLimit: number;
  private readonly _database: string;
  private readonly _host: string;
  private readonly _password: string;
  private readonly _user: string;

  constructor(private readonly _config: IConfigReader) {
    this._connectionLimit = Number(this._config.read('MYSQL_CONNECTION_LIMIT'));
    this._database = this._config.read('MYSQL_DATABASE');
    this._host = this._config.read('MYSQL_HOST');
    this._password = this._config.read('MYSQL_PASSWORD');
    this._user = this._config.read('MYSQL_USER');
  }
  get connectionLimit() {
    return this._connectionLimit;
  }
  get database() {
    return this._database;
  }
  get host() {
    return this._host;
  }
  get password() {
    return this._password;
  }
  get user() {
    return this._user;
  }
}
