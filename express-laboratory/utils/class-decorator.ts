function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  console.log('class 평가됨');
  return class extends constructor {
    newProperty = 'new property';
    hello = 'override';
  };
}

@classDecorator
class Greeter {
  property = 'property';
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}

// console.log(new Greeter('world'));
// {property: "property", hello: "override", newProperty: "new property"}
