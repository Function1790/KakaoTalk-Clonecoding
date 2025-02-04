import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

type ReturnUserEntity = Promise<User | null>;
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findById(id: number): ReturnUserEntity {
    return await this.userRepository.findOneBy({ id: id });
  }

  async findByField(option: FindOneOptions<UserDTO>): ReturnUserEntity {
    return await this.userRepository.findOne(option);
  }

  async encryptPassword(userDto: UserDTO) {
    userDto.password = await bcrypt.hash(userDto.password, 10);
  }

  async save(user: UserDTO): Promise<User> {
    await this.encryptPassword(user);
    return await this.userRepository.save(user);
  }
}
