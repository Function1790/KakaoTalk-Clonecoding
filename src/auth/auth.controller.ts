import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @Render('login')
  login() {
    return;
  }

  @Post('login')
  async verify(@Body() userDto: UserDTO) {
    const jwt = await this.authService.vaildateUser(userDto);
    return;
  }
}
