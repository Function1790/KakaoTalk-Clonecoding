import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { RoomService } from './room.service';

@Controller('chat')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  async chat(@Req() req: Request) {
    const roomId = Number(req.query.roomId);
    const room = await this.roomService.findById(roomId);
    if (!room) {
      return `404 Not Found(Room:{id: ${roomId}})`;
    }
    return room;
  }

  @Get('/test')
  async test() {
    const room = await this.roomService.findById(1);
    return { memeber: room.members };
  }
}
