import { Test } from '@nestjs/testing';
import Redis from 'ioredis';
import { v4 } from 'uuid';
import { RedisModule } from '../../cache/redis.module';
import { Symbols } from '../../symbols';
import { UserSearchRepositoryRedis } from '../repository/concrete/user-search-repository-redis';
import { IUserSearchRepository } from '../repository/user-search-repository.interface';

describe('user search keyword test', () => {
  let repo: IUserSearchRepository;
  let redis: Redis;
  const userId = v4();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RedisModule],
      providers: [UserSearchRepositoryRedis],
    }).compile();

    repo = moduleRef.get(UserSearchRepositoryRedis);
    redis = moduleRef.get(Symbols.redisClient);
  });

  afterEach(async () => {
    await redis.flushall();
  });

  afterAll(async () => {
    redis.disconnect();
  });

  test('유저가 검색한 키워드가 시간 기준 최신순으로 조회되어야 한다', async () => {
    const firstKeyword = 'first';
    const secondKeyword = 'second';

    await repo.insertSearchKeyword({ userId, keyword: firstKeyword, searchTime: new Date().getMilliseconds() });
    await repo.insertSearchKeyword({ userId, keyword: secondKeyword, searchTime: new Date().getMilliseconds() });

    const getKeywords = await repo.getKeywords(userId);

    expect(getKeywords[0]).toBe('second');
    expect(getKeywords[1]).toBe('first');
  });

  test('유저가 검색한 키워드는 최대 5개만 저장된다.', async () => {
    const keywords = ['1', '2', '3', '4', '5', '6'];

    for (const keyword of keywords) {
      await repo.insertSearchKeyword({ userId, keyword, searchTime: new Date().getMilliseconds() });
    }

    const getKeywords = await repo.getKeywords(userId);

    expect(getKeywords.length).toBe(5);
  });

  test('유저가 검색한 키워드는 가장 오래된 것을 기준으로 지워진다.', async () => {
    const keywords = ['1', '2', '3', '4', '5', '6'];

    for (const keyword of keywords) {
      await repo.insertSearchKeyword({ userId, keyword, searchTime: new Date().getMilliseconds() });
    }

    const getKeywords = await repo.getKeywords(userId);

    expect(getKeywords[0]).toBe('6');
  });
});
