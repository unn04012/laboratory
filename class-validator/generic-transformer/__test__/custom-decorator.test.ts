import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UserDto } from '../custom-decorator';

describe('Custom Decorators', () => {
  describe('TrimAndUppercase', () => {
    it('공백을 제거하고 대문자로 변환해야 한다', () => {
      const input = { name: '  john doe  ' };
      const userDto = plainToClass(UserDto, input);

      expect(userDto.name).toBe('JOHN DOE');
    });

    it('빈 문자열을 처리해야 한다', () => {
      const input = { name: '   ' };
      const userDto = plainToClass(UserDto, input);

      expect(userDto.name).toBe('');
    });

    it('문자열이 아닌 값들을 처리해야 한다', () => {
      const input = { name: null };
      const userDto = plainToClass(UserDto, input);

      expect(userDto.name).toBe(null);
    });
  });

  describe('ValidateEmail', () => {
    it('유효한 이메일을 검증하고 소문자로 변환해야 한다', () => {
      const input = { email: 'John.Doe@Example.COM' };
      const userDto = plainToClass(UserDto, input);

      expect(userDto.email).toBe('john.doe@example.com');
    });

    it('유효하지 않은 이메일 형식에 대해 오류를 발생시켜야 한다', () => {
      const input = { email: 'invalid-email' };

      expect(() => {
        plainToClass(UserDto, input);
      }).toThrow('Invalid email format');
    });

    it('도메인이 없는 이메일을 처리해야 한다', () => {
      const input = { email: 'test@' };

      expect(() => {
        plainToClass(UserDto, input);
      }).toThrow('Invalid email format');
    });
  });

  describe('FormatPhoneNumber', () => {
    it('10자리 전화번호를 포맷팅해야 한다', () => {
      const input = { phoneNumber: '1234567890' };
      const userDto = plainToClass(UserDto, input);

      expect(userDto.phoneNumber).toBe('(123) 456-7890');
    });

    it('국가코드가 있는 11자리 전화번호를 포맷팅해야 한다', () => {
      const input = { phoneNumber: '11234567890' };
      const userDto = plainToClass(UserDto, input);

      expect(userDto.phoneNumber).toBe('+1 (123) 456-7890');
    });

    it('특수문자가 있는 전화번호를 처리해야 한다', () => {
      const input = { phoneNumber: '(123) 456-7890' };
      const userDto = plainToClass(UserDto, input);

      expect(userDto.phoneNumber).toBe('(123) 456-7890');
    });

    it(' 유효하지 않은 전화번호 길이에 대해 원래 값을 반환해야 한다', () => {
      const input = { phoneNumber: '123' };
      const userDto = plainToClass(UserDto, input);

      expect(userDto.phoneNumber).toBe('123');
    });

    it('문자열이 아닌 값들을 처리해야 한다', () => {
      const input = { phoneNumber: null };
      const userDto = plainToClass(UserDto, input);

      expect(userDto.phoneNumber).toBe(null);
    });
  });

  describe('UserDto Validation', () => {
    it('완전한 사용자 데이터를 검증해야 한다', async () => {
      const input = {
        name: '  john doe  ',
        email: 'John.Doe@Example.COM',
        phoneNumber: '1234567890',
        age: 25,
      };

      const userDto = plainToClass(UserDto, input);
      const errors = await validate(userDto);

      expect(errors.length).toBe(0);
      expect(userDto.name).toBe('JOHN DOE');
      expect(userDto.email).toBe('john.doe@example.com');
      expect(userDto.phoneNumber).toBe('(123) 456-7890');
      expect(userDto.age).toBe(25);
    });

    it('필수 필드들을 검증해야 한다', async () => {
      const input = {};

      const userDto = plainToClass(UserDto, input);
      const errors = await validate(userDto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'name')).toBe(true);
      expect(errors.some((error) => error.property === 'email')).toBe(true);
    });

    it('선택적 필드들을 검증해야 한다', async () => {
      const input = {
        name: 'john doe',
        email: 'john@example.com',
      };

      const userDto = plainToClass(UserDto, input);
      const errors = await validate(userDto);

      expect(errors.length).toBe(0);
      expect(userDto.name).toBe('JOHN DOE');
      expect(userDto.email).toBe('john@example.com');
      expect(userDto.phoneNumber).toBeUndefined();
      expect(userDto.age).toBeUndefined();
    });

    it('나이를 숫자로 검증해야 한다', async () => {
      const input = {
        name: 'john doe',
        email: 'john@example.com',
        age: 'not-a-number',
      };

      const userDto = plainToClass(UserDto, input);
      const errors = await validate(userDto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'age')).toBe(true);
    });
  });
});
