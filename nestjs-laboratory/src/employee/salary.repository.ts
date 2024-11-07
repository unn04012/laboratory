import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReadStream } from 'fs';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SalariesSchema } from './schema/salaries.schema';

@Injectable()
export class SalaryRepository {
  constructor(@InjectRepository(SalariesSchema) private readonly _repo: Repository<SalariesSchema>) {}

  public async findByStream() {
    const qb: SelectQueryBuilder<SalariesSchema> = this._repo.createQueryBuilder('salaries');
    const stream: ReadStream = await qb.select().orderBy('salaries.from_date', 'DESC').stream();

    stream.on('data', (row) => {
      // 각 행을 처리
      console.log(row);
    });

    stream.on('end', () => {
      console.log('스트림 종료');
    });

    stream.on('error', (err) => {
      console.error('스트림 에러', err);
    });

    return stream;
  }

  public async findByBuffering() {
    const founds = await this._repo.find();

    return founds;
  }
}
