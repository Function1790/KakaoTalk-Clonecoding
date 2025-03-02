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

// TODO: room.ejs 삭제하기
@Controller('chat')
export class RoomController {
  constructor(
    private roomService: RoomService,
    private chatMessageService: ChatMessageService,
  ) {}

  @Render('test')
  @Get()
  sock_test() {
    return;
  }

  // TODO: /chat/ 로 접근시 오류 수정
  @Get(':id')
  @Render('test')
  async chat(@Param('id') id: number) {
    const room = await this.roomService.findById(id);
    if (!room || !id) {
      console.log(`404 Not Found(Room:{id: ${id}})`);
      throw new NotFoundException();
    }
    return {
      // 내부 데이터들 ejs에 넣는거 잊지 않도록 주의하기
      id: id,
      messages: room.messages,
      roomid: id,
    };
  }

  @Post(':id')
  async sendChat(@Body() chatMessage: ChatMessageDTO, @Param('id') id: number) {
    // 채팅 내역 데이터베이스
    await this.chatMessageService.create(id, chatMessage);
  }

  @Get('/test')
  async test() {
    const room = await this.roomService.findById(1);
    return { memeber: room.members };
  }
}
