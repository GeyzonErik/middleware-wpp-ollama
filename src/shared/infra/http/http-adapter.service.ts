export interface HttpRequest {
  url: string;
  data?: any;
  params?: any;
  headers?: any;
}

export interface HttpResponse<T = any> {
  status: number;
  data: T;
  headers: any;
}

export abstract class HttpAdapter {
  abstract post<T = any>(request: HttpRequest): Promise<HttpResponse<T>>;
}
