import { HttpAdapter } from 'src/shared/infra/http/http-adapter.service';
import { ConnectToWhatsapp } from '../usecases/connect-to-whatsapp.usecase';
import { OnMessage } from '../usecases/on-message.usecase';
import { SendMessage } from '../usecases/send-message.usecase';

export class WhatsappService {
  constructor(
    private readonly httpAdapter: HttpAdapter,
    private readonly connectToWhatsapp: ConnectToWhatsapp,
    private readonly onMessage: OnMessage,
    private readonly sendMessage: SendMessage,
  ) {}

  async init(): Promise<void> {
    await this.connectToWhatsapp.execute();

    await this.onMessage.execute(async (message) => {
      const messageType = Object.keys(message.message)[0] || null;

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
    const modifiedMessage = `
        Responda em português com frases curtas e diretas a seguinte menssagem,
        NUNCA ultrapassando os 350 caracteres, mesmo se a mensagem pedir:
        ${message}`;

    const response = await this.httpAdapter.post({
      url: 'http://localhost:11434/api/generate',
      data: {
        model: 'llama3.1',
        prompt: modifiedMessage,
        stream: false,
      },
    });

    return response.data.response;
  }
}
