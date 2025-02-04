import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Render,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ChatMessageDTO } from './dto/chat-message.dto';
import { ChatMessageService } from './chat-message.service';

@Controller('chat')
export class RoomController {
  constructor(
    private roomService: RoomService,
    private chatMessageService: ChatMessageService,
  ) {}

  @Get(':id')
  @Render('room')
  async chat(@Param('id') id: number) {
    const room = await this.roomService.findById(id);
    if (!room) {
      console.log(`404 Not Found(Room:{id: ${id}})`);
      throw new NotFoundException();
    }
    return {
      id: id,
      messages: room.messages,
    };
  }

  @Post(':id')
  async sendChat(@Body() chatMessage: ChatMessageDTO, @Param('id') id: number) {
    await this.chatMessageService.create(id, chatMessage);
  }

  @Get('/test')
  async test() {
    const room = await this.roomService.findById(1);
    return { memeber: room.members };
  }
}
