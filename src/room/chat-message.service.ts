import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entity/chat-message.entity';
import { UserService } from 'src/auth/user.service';
import { RoomService } from './room.service';
import { Room } from './entity/room.eneity';
import { ChatRole } from './type/role.type';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    private roomService: RoomService,
    private userService: UserService,
  ) {}

  async save(room: Room, message: string, userId: number, role: ChatRole) {
    const sender = await this.userService.findById(userId);
    await this.chatMessageRepository.save({
      sender,
      room,
      content: message,
      role,
    });
  }

  async getRoomChat(room: Room) {
    return await this.chatMessageRepository.find({
      where: { room },
      relations: ['sender', 'room'],
    });
  }
}
