import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entity/chat-message.entity';
import { ChatMessageDTO } from './dto/chat-message.dto';
import { UserService } from 'src/auth/user.service';
import { RoomService } from './room.service';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    private roomService: RoomService,
    private userService: UserService,
  ) {}

  async create(roomId: number, chatMessage: ChatMessageDTO) {
    const sender = await this.userService.findById(chatMessage.senderId);
    const room = await this.roomService.findById(roomId);
    await this.chatMessageRepository.save({
      sender: sender,
      room: room,
      content: chatMessage.content,
    });
  }
}
