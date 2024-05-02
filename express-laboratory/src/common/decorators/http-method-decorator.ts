// HTTP 메서드를 정의하는 데코레이터
function HttpMethod(method: string) {
  return function (path: string) {
    return function (target: any, key: string) {
      Reflect.defineMetadata('path', path, target, key);
      Reflect.defineMetadata('method', method, target, key);
    };
  };
}

// GET 메서드 데코레이터
export function Get(path: string) {
  return HttpMethod('GET')(path);
}

// POST 메서드 데코레이터
export function Post(path: string = '/') {
  return HttpMethod('POST')(path);
}
