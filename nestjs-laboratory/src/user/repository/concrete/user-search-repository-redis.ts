import { Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { Symbols } from '../../../symbols';
import { InsertKeywordParam, IUserSearchRepository } from '../user-search-repository.interface';

export class UserSearchRepositoryRedis implements IUserSearchRepository {
  private readonly _cacheKeyPrefix = 'SEARCH_KEYWOARDS';
  private readonly _recentKeywordCount = 5;

  constructor(@Inject(Symbols.redisClient) private readonly _redis: Redis) {}

  public async insertSearchKeyword({ userId, searchTime, keyword }: InsertKeywordParam): Promise<void> {
    const key = this._generatePrefix(userId);

    await this._redis.zadd(key, searchTime, keyword);

    await this._redis.zremrangebyrank(key, -this._recentKeywordCount - 1, -this._recentKeywordCount - 1);
  }

  public async getKeywords(userId: string): Promise<string[]> {
    const key = this._generatePrefix(userId);

    return await this._redis.zrevrange(key, 0, -1);
  }

  private _generatePrefix(userId: string) {
    return `${this._cacheKeyPrefix}:${userId}`;
  }
}
