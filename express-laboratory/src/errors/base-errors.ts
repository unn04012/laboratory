export class BaseBusinessError extends Error {
  private readonly _code: string;
  private readonly _message: string;

  constructor(code: string, message: string) {
    super();
    this._code = code;
    this._message = message;
  }

  get code() {
    return this._code;
  }
  get message() {
    return this._message;
  }
}
