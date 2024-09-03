import { ConnectToWhatsapp } from '../usecases/connect-to-whatsapp.usecase';
import { OnMessage } from '../usecases/on-message.usecase';
import { SendMessage } from '../usecases/send-message.usecase';
import { ClaudeService } from 'src/shared/application/services/claude.service';

export class WhatsappService {
  constructor(
    private readonly claudeService: ClaudeService,
    private readonly connectToWhatsapp: ConnectToWhatsapp,
    private readonly onMessage: OnMessage,
    private readonly sendMessage: SendMessage,
  ) {}

  async init(): Promise<void> {
    await this.connectToWhatsapp.execute();

    await this.onMessage.execute(async (message) => {
      const messageType = Object.keys(message?.message ?? {})[0] || null;

      switch (messageType) {
        case 'conversation':
        case 'extendedTextMessage': {
          const text =
            message.message.conversation ||
            message.message.extendedTextMessage.text;

          if (text) {
            const answer = await this.answerMessage(text);

            await this.sendMessage.execute({
              to: message.key.remoteJid!,
              message: answer,
            });
          }
          break;
        }

        case 'protocolMessage':
          console.log('erro de protocolo');
          break;

        default:
          console.log('formato de mensagem ainda não suportado');
          break;
      }
    });
  }

  private async answerMessage(message: string): Promise<string> {
    try {
      const response = await this.claudeService.post({
        url: '',
        data: { message: message },
      });

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
