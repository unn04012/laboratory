import { BaseBusinessError } from './base-errors';

enum AnalysisErrorEnum {
  PRODUCT_QUOTA_OVER = 'PRODUCT_QUOTA_OVER',
  PAYMENT_PRODUCT_NOT_FOUND = 'PAYMENT_PRODUCT_NOT_FOUND',
}

export class ProductQuotaOverError extends BaseBusinessError {
  constructor(message: string) {
    super(AnalysisErrorEnum.PRODUCT_QUOTA_OVER, message);
  }
}

export class PaymentProductNotFoundError extends BaseBusinessError {
  constructor(message: string) {
    super('PAYMENT_PRODUCT_NOT_FOUND', message);
  }
}

function ApiErrorResponse(errorClasses: Function | Function[]) {
  return (target: Function) => {
    if (Array.isArray(errorClasses)) {
      console.log(errorClasses.map((e) => e.name));
    } else {
      console.log(errorClasses.prototype);
      console.log(errorClasses.name);
      console.log(errorClasses);
    }
  };
}

@ApiErrorResponse(ProductQuotaOverError)
class SomeClass {
  // some code blah blah
}
