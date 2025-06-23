import { plainToInstance } from 'class-transformer';
import { ExternalApiDto } from './snake-case-transformer';
import { validate } from 'class-validator';

(async () => {
  // extern api response
  const data = {
    status_code: 200,
    pg_provider: 'KakaoPay',
    message: 'Payment successful',
  };

  const dto = plainToInstance(ExternalApiDto, data);

  console.log(dto);
})();
