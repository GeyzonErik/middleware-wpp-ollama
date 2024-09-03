import { Module } from '@nestjs/common';
import { HttpAdapter } from './infra/http/http-adapter.service';
import { AxiosHttpService } from './infra/http/http-axios/axios-http.service';
import { ClaudeService } from './application/services/claude.service';

@Module({
  providers: [
    {
      provide: HttpAdapter,
      useClass: AxiosHttpService,
    },
    ClaudeService,
  ],
  exports: [HttpAdapter, ClaudeService],
})
export class SharedModule {}
