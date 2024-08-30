import { UseCase } from 'src/shared/domains/usecases/usecase';
import { ChatAddapter } from 'src/shared/gateways/chats/chat.adapter';

interface IsendMessage {
  to: string;
  message: any;
}

export class SendMessage implements UseCase<IsendMessage, void> {
  constructor(private readonly whatsappGateway: ChatAddapter) {}

  async execute(data: IsendMessage): Promise<void> {
    await this.whatsappGateway.sendMessage(data.to, data.message);
  }
}
