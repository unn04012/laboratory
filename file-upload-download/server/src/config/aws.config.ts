import { S3Client } from '@aws-sdk/client-s3';
import { IConfigReader } from './interfaces/config-reader.interface';

export class S3Config {
  public readonly bucket: string;
  public readonly region: string;
  public readonly defaultExpiresIn: number;
  public readonly client: S3Client;

  constructor(configReader: IConfigReader) {
    this.region = configReader.get('AWS_REGION') || 'ap-northeast-2';
    this.bucket = configReader.getOrThrow('AWS_S3_BUCKET');
    this.defaultExpiresIn = configReader.getNumber('AWS_S3_EXPIRES_IN', 3600);

    this.client = new S3Client({
      region: this.region,
    });
  }
}
