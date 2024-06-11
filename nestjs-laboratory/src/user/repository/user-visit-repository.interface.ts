export type VisitUser = {
  userId: string;
  companyId: number;
  dateTime: Date;
};

export interface IUserVisitRepository {
  /**
   * 회사에 방문한 유저를 기록합니다
   * @param user
   */
  createVisitCompany(user: VisitUser): Promise<void>;

  /**
   * 방문 숫자를 구합니다.
   * @param companyId
   */
  getVisitCountByCompany(companyId: number, dateTime: Date): Promise<string[]>;
}
