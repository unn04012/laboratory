import { IConfigReader } from './interfaces/config-reader.interface';

export class EnvConfigReader implements IConfigReader {
  constructor(private readonly env: NodeJS.ProcessEnv = process.env) {}

  get(key: string): string | undefined {
    return this.env[key];
  }

  getOrThrow(key: string): string {
    const value = this.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
  }

  getNumber(key: string, defaultValue?: number): number {
    const value = this.env[key];
    if (!value) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return Number(value);
  }
}
