import { IConfigReader } from './config-reader.interface';

export class ConfigReader implements IConfigReader {
  public read(name: string): string {
    const found = process.env[name];
    if (!found) throw new Error(`not found config, name: ${name}`);

    return found;
  }
}
