import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

export class UserManageService {
  constructor(@Inject(CACHE_MANAGER) private readonly _cacheManager: Cache) {}

  public async setUser(userId: string) {
    await this._cacheManager.set(userId, userId);
  }
}
