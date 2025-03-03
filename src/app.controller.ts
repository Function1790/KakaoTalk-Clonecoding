import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  index(@Req() req: Request, @Res() res: Response) {
    const authJwt: string = req.cookies.token as string;
    const payload = this.authService.vaildateToken(authJwt);
    if (!payload) {
      res.redirect('/auth/login');
      return;
    }
    res.redirect('/chat');
    return;
  }

  @Get('/test')
  getHello(): string {
    return this.appService.getHello();
  }
}
