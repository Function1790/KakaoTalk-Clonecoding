import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entity/user.entity';
import { RoomModule } from './room/room.module';
import { Room } from './room/entity/room.eneity';
import { ChatMessage } from './room/entity/chat-message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1790',
      database: 'kakao',
      entities: [User, Room, ChatMessage],
      synchronize: true,
    }),
    AuthModule,
    RoomModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
