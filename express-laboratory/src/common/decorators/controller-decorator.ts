export function Controller(path: string) {
  return function (constructor: any) {
    Reflect.defineMetadata('path', path, constructor);
  };
}
