export class BaseBusinessError extends Error {
  private readonly _code: string;
  private readonly _subCode?: string;
  private readonly _message: string;

  private readonly _httpStatusCode = 400;

  constructor(code: string, message: string, subCode?: string) {
    super();
    this._code = code;
    this._message = message;
    this._subCode = subCode;
  }

  get code() {
    return this._code;
  }

  get message() {
    return this._message;
  }
  get subCode() {
    return this._subCode;
  }

  get httpStatusCode() {
    return this._httpStatusCode;
  }
}

export class NotFoundProduct extends BaseBusinessError {
  constructor(message: string) {
    super('NOT_FOUND_PRODUCT', message);
  }
}

export class NotFoundInventory extends BaseBusinessError {
  constructor(message: string) {
    super('NOT_FOUND_INVENTORY', message);
  }
}
