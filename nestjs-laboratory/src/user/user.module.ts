import { Module } from '@nestjs/common';
import { Symbols } from '../symbols';
import { UserVisitRepositoryRedis } from './repository/concrete/user-visit.repository';
import { UserController } from './user.controller';
import { UserManageService } from './user.service';
import { VisitorManageService } from './visitor-manage.service';

@Module({
  controllers: [UserController],

  providers: [
    UserManageService,
    VisitorManageService,
    {
      provide: Symbols.userVisitRepository,
      useClass: UserVisitRepositoryRedis,
    },
  ],
})
export class UserModule {}
