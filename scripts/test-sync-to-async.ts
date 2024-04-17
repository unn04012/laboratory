/**
 * 동기화 코드를 비동기로 변환해보기
 */

function addOnlyPromise(a: number, b: number) {
  return new Promise((resolve) => {
    console.log('event loop executed');
    resolve(a + b);
  });
}

function addWithAsyncFunctionOnPromise(a: number, b: number) {
  return new Promise((resolve) => {
    setImmediate(() => {
      console.log('event loop real executed');
      resolve(a + b);
    });
  });
}

// promise화 해도 비동기로 동작하지 않는다.
const added = addOnlyPromise(2, 3);
console.log('비동기 함수로 동작하나여');

// 비동기 함수를 호출을 해야 event loop에서 실행된다.
const addedByAsync = addWithAsyncFunctionOnPromise(2, 3);
console.log('비동기함수로 동작하나여2');
