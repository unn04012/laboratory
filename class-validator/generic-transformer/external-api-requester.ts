import axios, { AxiosResponse } from 'axios';
import { CommonResponse, GetMessageResponseDto, GetPgProviderDto } from './external-api.type';
import { plainToClass } from 'class-transformer';

export class ExternalApiRequester {
  private readonly _baseUrl: string;

  public async getPaymentPgProvider(params?: any): Promise<GetPgProviderDto> {
    const requestUrl = `${this._baseUrl}/v1/payment/pg-provider`;

    const response = await this._getRequest<GetPgProviderDto>(requestUrl, GetPgProviderDto);
    return response;
  }

  public async getPaymentMessage(params?: any): Promise<GetMessageResponseDto> {
    const requestUrl = `${this._baseUrl}/v1/payment/message`;
    const response = await this._getRequest<GetMessageResponseDto>(requestUrl, GetMessageResponseDto);
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
