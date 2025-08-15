import 'reflect-metadata';
import { getConfigModule, initConfigModule } from '../config';
import { RefEnvironmentEntity } from '../single-table-inheritance/schema/environment.schema';
import { WebEnvironmentEntity } from '../single-table-inheritance/schema/web-environment.schema';
import { dataSourceFactory, getDataSource } from '../typeorm/connection-factory';

(async () => {
  initConfigModule();

  await dataSourceFactory(getConfigModule('mysqlConfig'));

  const conn = getDataSource();

  //   const found = await conn.getRepository(RefEnvironmentEntity);

  //   const repo = conn.getRepository(RefEnvironmentEntity);
  //   const founds = await repo.find({ where: { type: 'app' } });
  const webRepo = conn.getRepository(WebEnvironmentEntity);

  const webEntity = webRepo.create({
    type: 'web',
    name: 'Web Environment',
    browser: [{ countryCode: 'KR', name: 'Chrome' }],
  });

  await webRepo.save(webEntity);
})();
