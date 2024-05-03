import express from 'express';
import { ProductOrderController } from '../product/product-order.controller';

// 라우터 등록 함수
export function registerRoutes(app: express.Application, controllers: any[]) {
  controllers.forEach((controller: any) => {
    const prefix = Reflect.getMetadata('path', controller);

    const prototype = Object.getPrototypeOf(controller);

    const methods = Object.getOwnPropertyNames(prototype);

    methods.forEach((method: string) => {
      const path = Reflect.getMetadata('path', prototype, method);
      const httpMethod = Reflect.getMetadata('method', prototype, method);
      console.log(path, httpMethod);
      if (path && httpMethod) {
        app[httpMethod.toLowerCase()](`${prefix}${path}`, controller.prototype[method].bind(controller.prototype));
      }
    });
  });
}
