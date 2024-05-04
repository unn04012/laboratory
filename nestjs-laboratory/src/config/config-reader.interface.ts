export interface IConfigReader {
  read(name: string): string;

  readOptional(name: string, defaultValue: string): string;
}
