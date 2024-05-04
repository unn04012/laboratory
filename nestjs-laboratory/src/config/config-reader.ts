import 'dotenv/config';
import { Injectable } from '@nestjs/common';

import { IConfigReader } from './config-reader.interface';

@Injectable()
export class ConfigReader implements IConfigReader {
  public readOptional(name: string, defaultValue: string): string {
    const found = process.env[name];
    return found ?? defaultValue;
  }
  public read(name: string): string {
    const found = process.env[name];
    if (!found) throw new Error(`not found config, name: ${name}`);

    return found;
  }
}
