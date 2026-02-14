export interface IConfigReader {
  get(key: string): string | undefined;
  getOrThrow(key: string): string;
  getNumber(key: string, defaultValue?: number): number;
}
