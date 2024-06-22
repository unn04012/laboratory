export interface ITokenManager {
  generateToken(userId: string): Promise<string>;

  verify(token: string): Promise<{
    usr: string;
    iat: string;
  }>;
}
