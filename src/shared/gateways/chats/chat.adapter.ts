export abstract class ChatAddapter {
  abstract connect(): Promise<void>;
  abstract onMessage(callback: (message: any) => void): void;
  abstract sendMessage(to: string, message: any): Promise<void>;
}
