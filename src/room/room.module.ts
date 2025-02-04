import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entity/room.eneity';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  exports: [TypeOrmModule, RoomService],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
