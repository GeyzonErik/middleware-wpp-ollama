import { Module } from '@nestjs/common';
import { HttpAdapter } from './infra/http/http-adapter.service';
// import { AxiosHttpService } from './infra/http/http-axios/axios-http.service';
import { ClaudeService } from './infra/http/http-axios/claude.service';

@Module({
  providers: [
    {
      provide: HttpAdapter,
      useClass: ClaudeService,
    },
  ],
  exports: [HttpAdapter],
})
export class SharedModule {}
