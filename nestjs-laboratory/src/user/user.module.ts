import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserManageService } from './user.service';
import { VisitorManageService } from './visitor-manage.service';

@Module({
  controllers: [UserController],
  //TODO: inject redis client
  providers: [UserManageService, VisitorManageService],
})
export class UserModule {}
