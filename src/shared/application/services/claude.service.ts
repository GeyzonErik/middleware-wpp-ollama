import Anthropic from '@anthropic-ai/sdk';
import {
  HttpAdapter,
  HttpRequest,
  HttpResponse,
} from 'src/shared/infra/http/http-adapter.service';

export class ClaudeService implements HttpAdapter {
  anthropic = new Anthropic({});

  constructor() {}

  async post<T = any>(request: HttpRequest): Promise<HttpResponse<T>> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1000,
        system: 'Respond only with short texts and in brazilian portuguese',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: request.data.message,
              },
            ],
          },
        ],
      });

      const messageContent = response.content[0];
      if (messageContent.type === 'text') {
        return {
          status: 200,
          data: messageContent.text as T,
          headers: {},
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
