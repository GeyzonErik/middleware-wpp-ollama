import { Module } from '@nestjs/common';
import { WhatsappController } from './presentation/controller/whatsapp.controller';
import { WhatsappService } from './application/service/whatsapp.service';
// import { HttpAdapter } from 'src/shared/infra/http/http-adapter.service';
import { ConnectToWhatsapp } from './application/usecases/connect-to-whatsapp.usecase';
import { OnMessage } from './application/usecases/on-message.usecase';
import { SendMessage } from './application/usecases/send-message.usecase';
import { ChatAddapter } from '../shared/gateways/chats/chat.adapter';
import { ChatModule } from 'src/shared/gateways/chats/chat.module';
import { SharedModule } from 'src/shared/shared.module';
import { ClaudeService } from 'src/shared/application/services/claude.service';

@Module({
  imports: [SharedModule, ChatModule],
  providers: [
    // Services
    {
      provide: WhatsappService,
      useFactory: (
        claudeService: ClaudeService,
        connectToWhatsapp: ConnectToWhatsapp,
        onMessage: OnMessage,
        sendMessage: SendMessage,
      ) => {
        return new WhatsappService(
          claudeService,
          connectToWhatsapp,
          onMessage,
          sendMessage,
        );
      },
      inject: [ClaudeService, ConnectToWhatsapp, OnMessage, SendMessage],
    },

    // UseCases
    {
      provide: ConnectToWhatsapp,
      useFactory: (whatsappGateway: ChatAddapter) =>
        new ConnectToWhatsapp(whatsappGateway),
      inject: [ChatAddapter],
    },
    {
      provide: OnMessage,
      useFactory: (whatsappGateway: ChatAddapter) =>
        new OnMessage(whatsappGateway),
      inject: [ChatAddapter],
    },
    {
      provide: SendMessage,
      useFactory: (whatsappGateway: ChatAddapter) =>
        new SendMessage(whatsappGateway),
      inject: [ChatAddapter],
    },
  ],
  controllers: [WhatsappController],
})
export class WhatsappModule {}
