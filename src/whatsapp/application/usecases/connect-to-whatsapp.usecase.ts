import { UseCase } from 'src/shared/domains/usecases/usecase';
import { ChatAddapter } from 'src/shared/gateways/chats/chat.adapter';

export class ConnectToWhatsapp implements UseCase<[], void> {
  constructor(private readonly whatsappGateway: ChatAddapter) {}

  async execute(): Promise<void> {
    await this.whatsappGateway.connect();
  }
}
