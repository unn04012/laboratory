import axios, { AxiosResponse } from 'axios';
import { CommonResponse, GetMessageResponseDto, GetPgProviderDto } from './external-api.type';
import { plainToClass } from 'class-transformer';

export class ExternalApiRequester {
  constructor() {}

  public async getPgProvider(url: string, params?: any): Promise<GetPgProviderDto> {
    const response = await this._getRequest<GetPgProviderDto>(url, GetPgProviderDto);
    return response;
  }

  public async getMessage(url: string, params?: any): Promise<GetMessageResponseDto> {
    const response = await this._getRequest<GetMessageResponseDto>(url, GetMessageResponseDto);
    return response;
  }

  private async _getRequest<T>(url: string, responseType: any): Promise<T> {
    try {
      const externalApiResponse = await axios.get<CommonResponse<T>>(url);

      const { response } = externalApiResponse.data;

      return plainToClass<T, AxiosResponse['data']>(responseType, response);
    } catch (err) {
      throw err;
    }
  }
}
