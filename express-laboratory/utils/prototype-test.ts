import 'reflect-metadata';

class MyClass {
  myMethod() {
    console.log('Hello from MyClass');
  }
}

// 메타데이터 설정
Reflect.defineMetadata('methods', ['myMethod'], MyClass, 'myMethod');

// MyClass의 메서드 목록을 메타데이터를 통해 확인
const methods = Reflect.getMetadata('methods', MyClass, 'myMethod');
console.log(methods); // MyClass의 메서드 목록이 출력됩니다.`
