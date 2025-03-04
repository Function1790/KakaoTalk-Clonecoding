import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entity/room.eneity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserService } from 'src/auth/user.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    private userService: UserService,
  ) {}

  async getAllRooms(): Promise<Room[]> {
    return await this.roomRepository.find({
      relations: ['members', 'messages', 'messages.sender'],
    });
  }

  async findById(id: number): Promise<Room | null> {
    return await this.roomRepository.findOne({
      where: { id: id },
      relations: ['members', 'messages', 'messages.sender'],
    });
  }

  async create(users: User[]) {
    let name = '';
    for (let i = 0; i < users.length; i++) {
      name += `${users[i].name}, `;
    }
    await this.roomRepository.save({
      name,
      members: users,
    });
  }

  async getRelatedRoomList(userId: number) {
    const rooms = await this.getAllRooms();
    const filteredRooms = rooms.filter((room) => {
      // some: 조건에 맞는 것이 있는지 확인
      return room.members.some((user: User) => user.id === userId);
    });
    return filteredRooms;
  }

  isExistUser(room: Room, userId: number) {
    for (let i = 0; i < room.members.length; i++) {
      if (room.members[i].id == userId) {
        return true;
      }
    }
    return false;
  }
}
