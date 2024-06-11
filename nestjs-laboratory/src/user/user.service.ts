import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { VisitorManageService } from './visitor-manage.service';

@Injectable()
export class UserManageService {
  constructor(@Inject(VisitorManageService) private readonly _visitorManageService: VisitorManageService) {}

  public async setUser(userId: string) {
    await this._visitorManageService.countVisitUser(2, userId, new Date());
  }
}
