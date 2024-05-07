import { Inject, Injectable } from '@nestjs/common';
import { Symbols } from '../symbols';
import { IConfigReader } from './config-reader.interface';

@Injectable()
export class AwsSQSConfig {
  private _queueName: string;
  private _queueUrl: string;

  constructor(@Inject(Symbols.configReader) readonly reader: IConfigReader) {
    this._queueName = reader.read('SQS_QUEUE_NAME');
    this._queueUrl = reader.read('SQS_QUEUE_URL');
  }

  public get queueName() {
    return this._queueName;
  }

  public get queueUrl() {
    return this._queueUrl;
  }
}
