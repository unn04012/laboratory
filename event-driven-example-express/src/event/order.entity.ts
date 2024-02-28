export class OrderEntity {
  constructor(private readonly _id: number, private readonly _name: string, private readonly _products: any[]) {}

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get protected() {
    return this._products;
  }
}
