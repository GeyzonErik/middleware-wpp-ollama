import { Module } from '@nestjs/common';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [WhatsappModule, SharedModule],
})
export class AppModule {}
