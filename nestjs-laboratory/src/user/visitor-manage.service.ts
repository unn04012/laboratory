import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { RedisStore } from 'cache-manager-redis-yet';
import { DateTime } from 'luxon';

export class VisitorManageService {
  private readonly _cacheKeyPrefix = 'DAILY_VISITORS';

  constructor(@Inject(CACHE_MANAGER) private readonly _cacheManager: RedisStore) {}

  /**
   * 방문자 정보를 기록합니다.
   */
  public async countVisitUser(companyId: number, userId: string, today: Date) {
    const date = DateTime.fromJSDate(today).toFormat('yyyyMMdd');
    const key = `${this._cacheKeyPrefix}:${companyId}:${date}`;

    const redisClient = this._cacheManager.client;

    await redisClient.sAdd(key, userId);
  }
}
