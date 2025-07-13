import { IsDefined, IsString } from 'class-validator';

export class CommonResponse<T> {
  readonly code: number;
  readonly message: string;
  readonly response: T;
}

export class GetPgProviderDto {
  @IsDefined()
  @IsString()
  readonly pgProvider: string;

  @IsDefined()
  @IsString()
  readonly message: string;
}

export class GetMessageResponseDto {
  readonly message: string;
}
