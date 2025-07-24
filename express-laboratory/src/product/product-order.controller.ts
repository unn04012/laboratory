import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { Controller } from '../common/decorators/controller-decorator';
import { Get, Post } from '../common/decorators/http-method-decorator';
import { getRepository } from '../init-repository';
import { ProductOrderService } from './product-order.service';

@Controller('/product')
export class ProductOrderController {
  private readonly _service: ProductOrderService;

  constructor() {
    const productRepo = getRepository().product();
    const orderRepo = getRepository().order();

    this._service = new ProductOrderService(productRepo, orderRepo);
  }

  @Get('/')
  public async getProducts(req: Request, res: Response) {
    return await this._service.getProducts();
  }

  @Post()
  public async createProduct(req: Request, res: Response) {
    const { productId } = req.body;
    const userId = v4();

    await this._service.orderWithPemesssticLock(productId, userId);
    res.json({});
  }

  @Post('/optimisitic-lock')
  public async createProductWithOptimisiticLock(req: Request, res: Response) {
    const { productId } = req.body;
    const userId = v4();

    await this._service.orderWithOptimisticLock(productId, userId);
    res.json({});
  }
}
