import { UseCase } from 'src/shared/domains/usecases/usecase';
import { ChatAddapter } from 'src/shared/gateways/chats/chat.adapter';

export class OnMessage implements UseCase<(message: any) => void, void> {
  constructor(private readonly whatsappGateway: ChatAddapter) {}

  async execute(callback: (message: any) => void): Promise<void> {
    await this.whatsappGateway.onMessage(callback);
  }
}
