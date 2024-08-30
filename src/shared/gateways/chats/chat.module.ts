import { Module } from '@nestjs/common';
import { ChatAddapter } from './chat.adapter';
import { BaileysGateway } from './providers/baileys-whatsapp.gateway';

@Module({
  providers: [
    {
      provide: ChatAddapter,
      useClass: BaileysGateway,
    },
  ],
  exports: [ChatAddapter],
})
export class ChatModule {}
