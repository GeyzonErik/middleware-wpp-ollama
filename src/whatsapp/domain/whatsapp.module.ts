import { Module } from '@nestjs/common';
import { WhatsappService } from '../application/services/whatsapp.service';
import { WhatsappController } from '../controller/whatsapp.controller';
import { Axios } from 'axios';

@Module({
  providers: [Axios, WhatsappService],
  controllers: [WhatsappController],
})
export class WhatsappModule {}
