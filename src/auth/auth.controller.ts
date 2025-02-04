import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

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
    return authJwt;
  }

  @Post('register')
  @Redirect('/auth/login', 301)
  async register(@Body() userDto: UserDTO) {
    return await this.authService.register(userDto);
  }

  @Get('test')
  isAuthenticated(@Req() req: Request) {
    const authJwt: string = req.cookies.token as string;
    const payload = this.authService.vaildateToken(authJwt);
    if (!payload) {
      return 'Nah Bro..';
    }
    return 'Good';
  }
}
