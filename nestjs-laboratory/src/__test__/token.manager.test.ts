import { Test } from '@nestjs/testing';
import { V4 } from 'paseto';
import { v4 } from 'uuid';
import { TokenManagerPaseto } from '../auth/token-manager/token-manager-paseto';
import { ITokenManager } from '../auth/token-manager/token-manager.interface';
import { TokenConfig } from '../config/config-token';
import { ConfigModule } from '../config/config.module';
import { Symbols } from '../symbols';

describe('TokenManager test', () => {
  let tokenManager: ITokenManager;

  beforeAll(async () => {
    const { secretKey, publicKey } = await V4.generateKey('public', { format: 'paserk' });
    const moduleFixture = Test.createTestingModule({
      imports: [ConfigModule],
      providers: [{ provide: Symbols.tokenManager, useClass: TokenManagerPaseto }],
    })
      .overrideProvider(TokenConfig)
      .useValue({ privateKey: secretKey, publicKey, expirationTime: 900 });

    tokenManager = (await moduleFixture.compile()).get(Symbols.tokenManager);
  });

  test('생성된 토큰과 해당 토큰으로 검증이 되어야 한다', async () => {
    const userId = v4();
    const token = await tokenManager.generateToken(userId);

    const verified = await tokenManager.verify(token);

    expect(verified.usr).toBe(userId);
  });

  test('잘못된 토큰으로 검증된 경우 error가 발생한다.', async () => {
    await expect(tokenManager.verify('token')).rejects.toThrow();
  });
});
