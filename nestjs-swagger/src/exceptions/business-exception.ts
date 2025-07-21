import { HttpStatus } from '@nestjs/common';
import { HttpBaseException } from './http-base-exception';

export class BusinessException extends HttpBaseException {
  constructor(code: string, message: string) {
    super(HttpStatus.BAD_REQUEST, code, message);
  }
}

export class NotAdultError extends BusinessException {
  constructor(message: string) {
    super('NOT_ADULT_ERROR', message);
  }
}
