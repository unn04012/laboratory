// function FirstDecorator() {
//   console.log('First decorator evaluated');
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     console.log('First decorator applied');
//   };
// }

function SecondDecorator() {
  console.log('Second decorator evaluated');
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(target, propertyKey);
    console.log('Second decorator applied');
  };
}
function CustomDecorator(target: any) {
  target.customProperty = 'custom value';
}

@CustomDecorator
class Example {
  //   @FirstDecorator()
  @SecondDecorator()
  method() {
    console.log('Method called');
  }
}

const example = new Example();
console.log(Example.prototype);
