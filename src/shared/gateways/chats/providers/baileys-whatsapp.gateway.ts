import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { ChatAddapter } from 'src/shared/gateways/chats/chat.adapter';

export class BaileysGateway implements ChatAddapter {
  private socket: any;

  async connect(): Promise<void> {
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

    this.socket.ev.on('creds.update', saveCreds);
  }

  onMessage(callback: (message: any) => void): void {
    this.socket.ev.on('messages.upsert', (m) => {
      const message = m.messages[0];

      if (message.key.remoteJid !== 'status@broadcast') {
        if (!message.key.fromMe) {
          callback(message);
        }
      }
    });
  }

  async sendMessage(to: string, message: any): Promise<void> {
    await this.socket.sendMessage(to, {
      text: message,
    });
  }
}
