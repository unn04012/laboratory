export type InsertKeywordParam = {
  userId: string;
  keyword: string;
  searchTime: number;
};
export interface IUserSearchRepository {
  /**
   * 기록합니다.
   * @param keyword
   */
  insertSearchKeyword(param: InsertKeywordParam): Promise<void>;

  /**
   * keyword를 기록합니다.
   * 내림차순으로 조회합니다.
   * @param userId
   */
  getKeywords(userId: string): Promise<string[]>;
}
