function ClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  console.log('class decorator');
  return class extends constructor {
    newProperty = 'new property';
    hello = 'override';
  };
}
function logging(target, name, descriptor) {
  const originMethod = descriptor.value;
  console.log('method decorator');
  descriptor.value = function (...args) {
    const res = originMethod.apply(this, args);
    console.log(`${name} method arguments: `, args);
    console.log(`${name} method return: `, res);
    return res;
  };
}

@ClassDecorator
class A {
  @logging
  public log() {}
}
const a = new A();
