import express from 'express';
import { ProductOrderController } from '../product/product-order.controller';

// 라우터 등록 함수
export function registerRoutes(app: express.Application, controllers: any[]) {
  controllers.forEach((controller: any) => {
    const prefix = Reflect.getMetadata('path', controller);
    const prototype = Object.getPrototypeOf(controller.prototype);
    const methods = Object.getOwnPropertyNames(prototype);
    console.log(ProductOrderController.prototype);
    methods.forEach((method: string) => {
      const path = Reflect.getMetadata('path', prototype, method);
      const httpMethod = Reflect.getMetadata('method', prototype, method);
      console.log(path, httpMethod);
      if (path && httpMethod) {
        console.log(`${prefix}${path}`);
        app[httpMethod.toLowerCase()](`${prefix}${path}`, controller.prototype[method].bind(controller.prototype));
      }
    });
  });
}
