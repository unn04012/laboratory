import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class HttpBaseException {
  constructor(
    private readonly _statusCode: HttpStatus,
    private readonly _code: string,
    private readonly _message: string,
  ) {}

  @ApiProperty()
  get statusCode(): number {
    return this._statusCode;
  }

  @ApiProperty()
  get code(): string {
    return this._code;
  }

  @ApiProperty()
  get message(): string {
    return this._message;
  }
}
