import { plainToInstance } from 'class-transformer';
import { ExternalApiDto } from '../snake-case-transformer';

describe('snake-case-transform', () => {
  it('should transform snake_case to camelCase', async () => {
    const data = {
      status_code: 200,
      pg_provider: 'KakaoPay',
      message: 'Payment successful',
    };

    const dto = plainToInstance(ExternalApiDto, data);

    expect(dto.statusCode).toBe(200);
    expect(dto.pgProvider).toBe('KakaoPay');
    expect(dto.message).toBe('Payment successful');
  });
});
