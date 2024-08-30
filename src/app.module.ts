import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [WhatsappModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
