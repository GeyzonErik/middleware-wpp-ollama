import {
  HttpAdapter,
  HttpRequest,
  HttpResponse,
} from '../http-adapter.service';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class AxiosHttpService implements HttpAdapter {
  private readonly axiosInstace: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.axiosInstace = axios.create(config);
  }

  async post<T = any>(request: HttpRequest): Promise<HttpResponse<T>> {
    const response = await this.axiosInstace.post<T>(
      request.url,
      request.data,
      { params: request.params, headers: request.headers },
    );

    return response;
  }
}
