import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //Cookie
  app.enableCors({
    // cors 설정
    origin: 'http://localhost:3000',
    credentials: true, // 쿠키를 사용할 수 있게 해당 값을 true로 설정
  });
  app.use(cookieParser());

  //View
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(3000);
}

bootstrap();
