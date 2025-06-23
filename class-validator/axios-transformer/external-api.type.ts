import { Expose } from 'class-transformer';

export class CommonResponse<T> {
  readonly code: number;
  readonly message: string;
  readonly response: T;
}

export class GetPgProviderDto {
  @Expose({ name: 'pg_provider' })
  readonly pgProvider: string;

  readonly message: string;
}

export class GetMessageResponseDto {
  readonly message: string;
}
