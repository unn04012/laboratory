import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserManageService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserManageService],
})
export class UserModule {}
