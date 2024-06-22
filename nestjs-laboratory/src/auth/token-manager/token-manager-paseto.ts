import { Injectable } from '@nestjs/common';
import { V4 } from 'paseto';
import { TokenConfig } from '../../config/config-token';
import { ITokenManager } from './token-manager.interface';

@Injectable()
export class TokenManagerPaseto implements ITokenManager {
  constructor(private readonly _config: TokenConfig) {}

  public async generateToken(userId: string): Promise<string> {
    const token = await V4.sign(
      {
        usr: userId,
      },
      this._config.privateKey,
      { expiresIn: `${this._config.expirationTime}s` },
    );

    return token;
  }

  public async verify(token: string): Promise<{
    usr: string;
    iat: string;
  }> {
    const verifeid = await V4.verify<{ usr: string; iat: string }>(token, this._config.publicKey);

    return verifeid;
  }
}
