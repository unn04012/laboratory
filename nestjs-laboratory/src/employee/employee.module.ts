import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SalaryRepository } from './salary.repository';
import { SalariesSchema } from './schema/salaries.schema';

@Module({
  imports: [TypeOrmModule.forFeature([SalariesSchema])],
  providers: [SalaryRepository],
  exports: [SalaryRepository],
})
export class EmployeeModule {}
