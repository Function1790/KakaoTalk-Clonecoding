import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(userDto: UserDTO) {
    const existUser = await this.userService.findByField({
      where: { ...userDto },
    });
    if (existUser) {
      return false;
    }
    return await this.userService.save(userDto);
  }

  async vaildateUser(
    userDto: UserDTO,
  ): Promise<{ accessToken: string } | null> {
    //이름으로 DB 조회
    const existUser = await this.userService.findByField({
      where: { name: userDto.name },
    });
    if (!existUser) return null;
    //비밀번호 일치 확인
    const isMatch = await bcrypt.compare(userDto.password, existUser.password);
    if (!isMatch) return null;
    //jwt발급
    const payload: Payload = {
      id: existUser.id,
      name: existUser.name,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
