import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entity/room.eneity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  async findById(id: number): Promise<Room | null> {
    return await this.roomRepository.findOneBy({ id: id });
  }

  async create(users: User[]) {
    let name = '';
    for (let i = 0; i < users.length; i++) {
      name += `${users[i].name}, `;
    }
    await this.roomRepository.save({
      name,
      users,
    });
  }
}
