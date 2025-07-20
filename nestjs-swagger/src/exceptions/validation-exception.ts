import { HttpStatus } from '@nestjs/common';
import { HttpBaseException } from './http-base-exception';

export class ValidationException extends HttpBaseException {
  constructor(code: string, message: string) {
    super(HttpStatus.BAD_REQUEST, code, message);
  }
}
