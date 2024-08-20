import Redis from 'ioredis';
import { Inject } from '@nestjs/common';

import { Symbols } from '../symbols';
import { Nullable } from '../common/types';

export class RedisCommandHandler {
  constructor(@Inject(Symbols.redisClient) private readonly _redisClient: Redis) {}

  /**
   * key가 없을 때만 set이 실행이 되며 동시성 제어를 위해서 사용한다.
   */
  public async setNx({ key, identifier }: { key: string; identifier: any }): Promise<Nullable<number>> {
    const redisKey = `lock:${key}:${identifier}`;
    return await this._redisClient.setnx(redisKey, identifier);
  }

  public async del(key: string) {
    await this._redisClient.del(key);
  }
}
