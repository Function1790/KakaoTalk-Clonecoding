import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async vaildateUser(user: UserDTO) {
    return;
  }
}
