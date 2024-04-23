export class NotFoundProductOrder extends Error {
  constructor(message: string) {
    super(`PRODUCT_NOT_FOUND: ${message}`);
  }
}

export class ProductNotRemainStock extends Error {
  constructor(message: string) {
    super(`PRODUCT_NOT_ORDER: ${message}`);
  }
}
