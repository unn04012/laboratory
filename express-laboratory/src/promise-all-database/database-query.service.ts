import { ProductRepository } from '../product/product.repository';
import { getDataSource } from '../typeorm/connection-factory';

export class DatabaseQueryService {
  constructor(private readonly _productRepo: ProductRepository) {}

  public async insertProduct(delayTimes: number[]) {
    const start = performance.now();
    const promisedSleep = delayTimes.map((e) => this._productRepo.sleep(e));

    await Promise.all(promisedSleep);
    const end = performance.now();

    const elapsedTime = end - start;

    return elapsedTime / 1000;
  }

  public async insertProductInTransaction(delayTimes: number[]) {
    const start = performance.now();

    await getDataSource().transaction(async (mgr) => {
      const promisedSleep = delayTimes.map((e) => this._productRepo.sleep(e, mgr));
      await Promise.all(promisedSleep);
    });

    const end = performance.now();

    const elapsedTime = end - start;

    return elapsedTime / 1000;
  }
}
