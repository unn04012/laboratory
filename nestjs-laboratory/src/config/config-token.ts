import { Inject, Injectable } from '@nestjs/common';
import { Symbols } from '../symbols';
import { IConfigReader } from './config-reader.interface';

@Injectable()
export class TokenConfig {
  private _privateKey: string;
  private _publicKey: string;
  private _expirationTime: number;

  constructor(@Inject(Symbols.configReader) readonly reader: IConfigReader) {
    this._privateKey = reader.read('TOKEN_PRIVATE_KEY');
    this._privateKey = reader.read('TOKEN_PUBLIC_KEY');
    this._expirationTime = Number(reader.readOptional('TOKEN_EXPRATION_TIME', '900'));
  }

  public get privateKey() {
    return this._privateKey;
  }

  public get expirationTime() {
    return this._expirationTime;
  }

  public get publicKey() {
    return this._publicKey;
  }
}
