import { Controller, Get, Inject, Post } from '@nestjs/common';
import { v4 } from 'uuid';
import { UserManageService } from './user.service';
import { VisitorManageService } from './visitor-manage.service';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserManageService) private readonly _userManageService: UserManageService,
    @Inject(VisitorManageService) private readonly _visitorManageService: VisitorManageService,
  ) {}

  @Post('/auth')
  public async login() {
    const userId = v4();
    await this._userManageService.setUser(userId);
  }

  @Get('/visit-count')
  public async getVisitCount() {
    return await this._visitorManageService.getVisitCountByCompanyId(2, new Date());
  }
}
