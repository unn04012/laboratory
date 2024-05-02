import 'reflect-metadata';
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

function Controller(path: string) {
  return function (target: any) {
    Reflect.defineMetadata('controllerPath', path, target);
  };
}

function Get(path: string) {
  return function (target: any) {
    Reflect.defineMetadata('methodPath', path, target);
  };
}

@Controller('path')
class Example {
  method() {
    console.log('Method called');
  }
}

const example = new Example();
Reflect.defineMetadata('version', 1, Example);

console.log(Reflect.getMetadata('version', Example));
