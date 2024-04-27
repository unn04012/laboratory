import { getConfigModule, initConfigModule } from '../../config';
import { getRepository, initRepositores } from '../../init-repository';
import { dataSourceFactory, getDataSource } from '../../typeorm/connection-factory';
import { DatabaseQueryService } from '../database-query.service';

describe('promise all 쿼리 테스트', () => {
  beforeAll(async () => {
    initConfigModule();

    await dataSourceFactory(getConfigModule('mysqlConfig'));
    initRepositores();
  });

  afterAll(async () => {
    await getDataSource().destroy();
  });

  test('여러개의 db 커넥션에서의 promise.all은 병렬 처리가 된다', async () => {
    const productRepo = getRepository().product();

    const service = new DatabaseQueryService(productRepo);
    // 1초, 2초, 3초가 걸리는 퀄리 실행
    const elapsedTime = await service.insertProduct([1, 2, 3]);

    expect(elapsedTime).toBeCloseTo(3, 1);
  });

  test.only('하나의 트랜잭션에서는 promise.all이 병렬로 처리되지 않고 순차적으로 처리된다.', async () => {
    const productRepo = getRepository().product();

    const service = new DatabaseQueryService(productRepo);
    // 1초, 2초, 3초가 걸리는 퀄리 실행
    const elapsedTime = await service.insertProductInTransaction([1, 2, 3]);

    expect(elapsedTime).toBeCloseTo(6, 1);
  });
});
