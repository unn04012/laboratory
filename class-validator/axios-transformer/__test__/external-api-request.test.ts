import axios from 'axios';
import { ExternalApiRequester } from '../external-api-requester';
import { GetMessageResponseDto, GetPgProviderDto } from '../external-api.type';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(async () => {
  mockedAxios.get.mockResolvedValue({
    data: {
      code: 0,
      response: {
        pg_provider: '123',
        message: 1234,
      },
      message: 'success',
    },
  });
});

describe('다양한 formatter를 사용하여 외부 API 응답을 변환할 수 있다', () => {
  test('pg provider를 DTO로 변환한다.', async () => {
    const requester = new ExternalApiRequester();
    const response = await requester.getPgProvider('test-url');

    expect(response).toBeInstanceOf(GetPgProviderDto);
    expect(response.pgProvider).toBe('123');
    expect(response.message).toBe(1234);
    expect(mockedAxios.get).toHaveBeenCalledWith('test-url');
  });

  test('message DTO로 변환한다.', async () => {
    const requester = new ExternalApiRequester();
    const response = await requester.getMessage('test-url');

    expect(response).toBeInstanceOf(GetMessageResponseDto);
    expect(response.message).toBe(1234);
  });
});
