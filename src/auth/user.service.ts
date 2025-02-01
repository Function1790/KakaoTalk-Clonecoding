import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

type ReturnUserEntity = Promise<User | null>;
type ReturnResolve = Promise<void>;

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

  async encryptPassword(user: UserDTO): ReturnResolve {
    user.password = await bcrypt.hash(user.password, 10);
    return Promise.resolve();
  }

  async save(user: UserDTO) {
    await this.encryptPassword(user);
    await this.userRepository.save(user);
  }
}
