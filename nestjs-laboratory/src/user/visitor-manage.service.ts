import { Inject } from '@nestjs/common';

import { DateTime } from 'luxon';
import { Symbols } from '../symbols';
import Redis from 'ioredis';

export class VisitorManageService {
  private readonly _cacheKeyPrefix = 'DAILY_VISITORS';

  constructor(@Inject(Symbols.redisClient) private readonly _client: Redis) {}

  /**
   * 방문자 정보를 기록합니다.
   */
  public async countVisitUser(companyId: number, userId: string, today: Date) {
    const date = DateTime.fromJSDate(today).toFormat('yyyyMMdd');

    const key = `${this._cacheKeyPrefix}:${companyId}:${date}`;

    await this._client.sadd(key, userId);
  }
}
