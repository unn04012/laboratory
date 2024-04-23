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

  router.post(
    '/',
    wrapAsync(async (req, res, next) => {
      const { productId } = req.body;
      const userId = v4();

      await service.order(productId, userId);
      res.json({});
    })
  );

  return router;
}
