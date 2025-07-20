import { HttpStatus } from '@nestjs/common';
import { HttpBaseException } from './http-base-exception';

export class NotFoundException extends HttpBaseException {
  constructor(code: string, message: string) {
    super(HttpStatus.NOT_FOUND, code, message);
  }
}

export class NotFoundProduct extends NotFoundException {
  constructor(message: string) {
    super('NOT_FOUND_PRODUCT', message);
  }
}

export class NotFoundUser extends NotFoundException {
  constructor(message: string) {
    super('NOT_FOUND_USER', message);
  }
}
