import { Injectable } from '@nestjs/common';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class WhatsappService {
  private http: AxiosInstance;
  private socket: any;
  private answer: string;

  constructor() {
    this.http = axios.create();
  }

  async connect() {
    const { state, saveCreds } =
      await useMultiFileAuthState('auth_info_baileys');

    this.socket = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      qrTimeout: 900000,
    });

    this.socket.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;
        console.log(
          'connection closed due to ',
          lastDisconnect.error,
          ', reconnecting ',
          shouldReconnect,
        );
        // reconnect if not logged out
        if (shouldReconnect) {
          this.connect();
        }
      } else if (connection === 'open') {
        console.log('opened connection');
      }
    });

    this.socket.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0];

      const messageType = Object.keys(message.message)[0];

      if (!message.key.fromMe) {
        if (messageType === 'conversation' || 'extendedTextMessage') {
          const text =
            message.message.conversation ||
            message.message.extendedTextMessage.text;

          this.answer = await this.answerMessage(text);

          await this.socket.sendMessage(message.key.remoteJid!, {
            text: this.answer,
          });
        } else {
          console.log('formato de mensagem ainda não suportado');
        }
      }
    });

    this.socket.ev.on('creds.update', saveCreds);
  }

  private async answerMessage(message: string) {
    const modifiedMessage = `
        Responda em português com frases curtas e diretas a seguinte menssagem, 
        NUNCA ultrapassando os 350 caracteres, mesmo se a mensagem pedir: 
        ${message}`;

    const response = await this.http.post(
      'http://localhost:11434/api/generate',
      {
        model: 'llama3.1',
        prompt: modifiedMessage,
        stream: false,
      },
    );

    return response.data.response;
  }
}
