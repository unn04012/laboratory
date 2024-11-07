import { NestFactory } from '@nestjs/core';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from '../src/app.module';
import { SalaryRepository } from '../src/employee/salary.repository';
(async () => {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  const repo = app.get(SalaryRepository);

  const all = await repo.findByStream();

  console.log(all);

  //   process.exit(1);
})();
