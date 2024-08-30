import { Controller, Get, Post } from '@nestjs/common';
import { WhatsappService } from 'src/whatsapp/application/service/whatsapp.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('whatsapp')
@ApiTags('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('status')
  async getStatus() {
    return { status: 'running' };
  }

  @Post('init')
  async initBot() {
    await this.whatsappService.init();
    return { message: 'Bot initialized' };
  }
}
