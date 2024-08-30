import { Module } from '@nestjs/common';
import { HttpAdapter } from './infra/http/http-adapter.service';
import { AxiosHttpService } from './infra/http/http-axios/axios-http.service';

@Module({
  providers: [
    {
      provide: HttpAdapter,
      useClass: AxiosHttpService,
    },
  ],
  exports: [HttpAdapter],
})
export class SharedModule {}
