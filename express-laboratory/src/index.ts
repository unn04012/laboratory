import 'reflect-metadata';
import { getConfigModule, initConfigModule } from './config';
import { TitlesEntity } from './schemas/titles';
import { dataSourceFactory, getDataSource } from './typeorm/connection-factory';

(async () => {
  initConfigModule();
  await dataSourceFactory(getConfigModule('mysqlConfig'));

  const repo = getDataSource().getRepository(TitlesEntity);

  console.time();

  const titles = await repo.find();

  const promisedUpdates = titles.map(({ empNo, title, fromDate }) => repo.update({ empNo, title, fromDate }, { toDate: new Date() }));

  await Promise.all(promisedUpdates);

  // for (const { empNo, title, fromDate } of titles) {
  //   await repo.update({ empNo, title, fromDate }, { toDate: new Date() });
  // }

  console.timeEnd();
})();
