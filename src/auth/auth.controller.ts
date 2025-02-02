import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Res,
} from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @Render('login')
  loginRender() {
    return;
  }

  @Get('register')
  @Render('register')
  registerRender() {
    return;
  }

  //TODO: JWT도입
  @Post('login')
  @Redirect('/', 301)
  async verify(@Body() userDto: UserDTO, @Res() res: Response) {
    const authJwt = await this.authService.vaildateUser(userDto);
    if (!authJwt) {
      return false;
    }
    res.setHeader('Authorization', 'Bearer ' + authJwt.accessToken);
    res.cookie('token', authJwt.accessToken, {
      maxAge: 900000,
      httpOnly: true,
    });
    console.log(authJwt);
    return authJwt;
  }

  @Post('register')
  @Redirect('/auth/login', 301)
  async register(@Body() userDto: UserDTO) {
    return await this.authService.register(userDto);
  }
}
