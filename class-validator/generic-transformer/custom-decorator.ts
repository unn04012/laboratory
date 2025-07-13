import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsDefined } from 'class-validator';

export function TrimAndUppercase() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim().toUpperCase();
    }
    return value;
  });
}

export function ValidateEmail() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error('Invalid email format');
      }
      return value.toLowerCase();
    }
    return value;
  });
}

export function FormatPhoneNumber() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      }
      if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
      }
      return value;
    }
    return value;
  });
}

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @TrimAndUppercase()
  @IsDefined()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ValidateEmail()
  @IsDefined()
  email: string;

  @IsString()
  @FormatPhoneNumber()
  phoneNumber?: string;

  @IsNumber()
  age?: number;
}
