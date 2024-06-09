import { Controller, Inject, Post } from '@nestjs/common';
import { v4 } from 'uuid';
import { UserManageService } from './user.service';

@Controller('user')
export class UserController {
  constructor(@Inject(UserManageService) private readonly _userManageService: UserManageService) {}

  @Post('/auth')
  public async login() {
    const userId = v4();
    await this._userManageService.setUser(userId);
  }
}
