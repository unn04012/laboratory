// import { HttpException } from '@nestjs/common';
// import { ExceptionOrExceptionArrayFunc } from '../types/api-excpetion.type';

// function instantiateExceptions<T extends HttpException>(
//   exceptions: ExceptionOrExceptionArrayFunc<T>,
// ): T[] {
//   const exceptionClasses = exceptions(); // 화살표 함수 실행으로 클래스들을 얻음

//   if (Array.isArray(exceptionClasses)) {
//     return exceptionClasses.map((exception) => {
//       try {
//         return new exception(); // 매개변수 없는 생성자 호출
//       } catch (error) {
//         // 매개변수가 필요한 경우 기본값으로 시도
//         return new ExceptionClass('Default message');
//       }
//     });
//   } else {
//     try {
//       return [new exceptionClasses()];
//     } catch (error) {
//       return [new exceptionClasses('Default message')];
//     }
//   }
// }
