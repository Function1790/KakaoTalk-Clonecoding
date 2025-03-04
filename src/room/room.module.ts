import { forwardRef, Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entity/room.eneity';
import { ChatMessage } from './entity/chat-message.entity';
import { ChatMessageService } from './chat-message.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, ChatMessage]),
    forwardRef(() => AuthModule),
  ],
  exports: [TypeOrmModule, RoomService, ChatMessageService],
  controllers: [RoomController],
  providers: [RoomService, ChatMessageService],
})
export class RoomModule {}
