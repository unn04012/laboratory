import { Router } from 'express';
import { v4 } from 'uuid';
import { getRepository } from '../init-repository';
import wrapAsync from '../wrap-async';
import { ProductOrderService } from './product-order.service';

export function initProductOrderRouter() {
  const router = Router();

  const productRepo = getRepository().product();
  const orderRepo = getRepository().order();

  const service = new ProductOrderService(productRepo, orderRepo);

  router.get(
    '/',
    wrapAsync(async (req, res, next) => {
      const { productId } = req.body;
      const userId = v4();

      const result = await service.getProducts();
      res.json(result);
    })
  );

  router.post(
    '/',
    wrapAsync(async (req, res, next) => {
      const { productId } = req.body;
      const userId = v4();

      await service.orderWithPemesssticLock(productId, userId);
      res.json({});
    })
  );

  router.post(
    '/optimistic-lock',
    wrapAsync(async (req, res, next) => {
      const { productId } = req.body;
      const userId = v4();

      await service.orderWithOptimisticLock(productId, userId);
      res.json({});
    })
  );

  return router;
}
