import { Inject, Injectable } from '@nestjs/common';
import { ITokenManager } from './token-manager/token-manager.interface';

@Injectable()
export class AuthService {
  constructor(private readonly _tokenManager: ITokenManager) {}

  public login(userId: string) {
    const token = this._tokenManager.generateToken(userId);

    return token;
  }
}
