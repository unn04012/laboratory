import Redis from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';

import { Symbols } from '../../../symbols';
import { IUserVisitRepository, VisitUser } from '../user-visit-repository.interface';
import { DateTime } from 'luxon';

@Injectable()
export class UserVisitRepositoryRedis implements IUserVisitRepository {
  private readonly _cacheKeyPrefix = 'DAILY_VISITORS';

  constructor(@Inject(Symbols.redisClient) private readonly _redis: Redis) {}

  public async getVisitCountByCompany(companyId: number, dateTime: Date): Promise<string[]> {
    const key = this._makeKeyPrefix(companyId, dateTime);

    const result = await this._redis.smembers(key);

    return result;
  }

  public async createVisitCompany({ userId, companyId, dateTime }: VisitUser): Promise<void> {
    const key = this._makeKeyPrefix(companyId, dateTime);

    await this._redis.sadd(key, userId);
  }

  private _makeKeyPrefix(companyId: number, dateTime: Date) {
    const date = DateTime.fromJSDate(dateTime).toFormat('yyyyMMdd');

    const key = `${this._cacheKeyPrefix}:${companyId}:${date}`;

    return key;
  }
}
