import { Expose } from 'class-transformer';
import { IsDefined } from 'class-validator';

export class ExternalApiDto {
  @Expose({ name: 'status_code' })
  @IsDefined()
  readonly statusCode: number;

  @Expose({ name: 'pg_provider' })
  @IsDefined()
  readonly pgProvider: string;

  @IsDefined()
  readonly message: string;
}
