import { Inject, Injectable } from '@nestjs/common';

import { Symbols } from '../symbols';
import { IUserVisitRepository } from './repository/user-visit-repository.interface';

@Injectable()
export class VisitorManageService {
  constructor(@Inject(Symbols.userVisitRepository) private readonly _userVisitRepository: IUserVisitRepository) {}

  /**
   * 방문자 정보를 기록합니다.
   */
  public async countVisitUser(companyId: number, userId: string, today: Date) {
    await this._userVisitRepository.createVisitCompany({ userId, companyId, dateTime: today });
  }

  public async getVisitCountByCompanyId(companyId: number, today: Date) {
    const users = await this._userVisitRepository.getVisitCountByCompany(companyId, today);

    return users.length;
  }
}
