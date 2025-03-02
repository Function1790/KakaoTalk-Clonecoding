import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { expiresIn: '30000s' },
    }),
    PassportModule,
    RoomModule,
  ],
  exports: [TypeOrmModule, AuthService, UserService, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
