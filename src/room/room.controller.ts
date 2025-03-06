/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Render,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ChatMessageService } from './chat-message.service';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/auth/user.service';

// TODO: room.ejs 삭제하기
@Controller('chat')
export class RoomController {
  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private userService: UserService,
    private chatMessageService: ChatMessageService,
  ) {}

  @Get()
  @Render('room-list')
  async sock_test(@Req() req: Request) {
    const authJwt: string = req.cookies.token as string;
    const payload = this.authService.vaildateToken(authJwt);
    if (!payload) {
      return;
    }
    const rooms = await this.roomService.getRelatedRoomList(payload.id);
    return {
      rooms,
    };
  }

  // TODO: /chat/ 로 접근시 오류 수정
  @Get('room/:id')
  @Render('chat')
  async chat(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') roomId: number,
  ) {
    // 인가
    const authJwt: string = req.cookies.token as string;
    const payload = this.authService.vaildateToken(authJwt);
    if (!payload) {
      // TODO: 이부분 테스트하기
      res.redirect('/auth/login');
      return;
    }

    // 권한 및 방 존재 확인
    const room = await this.roomService.findById(roomId);
    const isExist = this.roomService.isExistUser(room, payload.id);
    if (!room || !roomId) {
      console.log(`404 Not Found(Room:{id: ${roomId}})`);
      throw new NotFoundException();
    } else if (!isExist) {
      console.log('401 Unauthorized(Members:', room.members, ')');
      throw new UnauthorizedException();
    }

    return {
      // 내부 데이터들 ejs에 넣는거 잊지 않도록 주의하기
      roomId: roomId,
      room: room,
      messages: room.messages,
      userId: payload.id,
    };
  }

  @Get('friends')
  @Render('friends')
  async displayFriends(@Req() req: Request, @Res() res: Response) {
    // 인가
    const authJwt: string = req.cookies.token as string;
    const payload = this.authService.vaildateToken(authJwt);
    if (!payload) {
      res.redirect('/auth/login');
      return;
    }
    const user = await this.userService.findById(payload.id);
    return {
      me: user,
      friends: user.friends,
    };
  }

  @Get('add/friend')
  @Render('add-friend')
  addFriendRender() {
    return;
  }

  @Post('add/friend')
  async addFriend(
    @Req() req: Request,
    @Body('id') targetId: number,
    @Res() res: Response,
  ) {
    // 인가
    const authJwt: string = req.cookies.token as string;
    const payload = this.authService.vaildateToken(authJwt);
    if (!payload) {
      res.redirect('/auth/login');
      return;
    }
    // DB 조회
    const me = await this.userService.findById(payload.id);
    const friend = await this.userService.findById(targetId);
    if (!me || !friend) {
      console.log('존재하지 않는 ID');
      res.redirect('/chat/add/friend');
      return;
    }
    me.friends.push(friend); // 여기기
    friend.friends.push(me);
    await this.userService.update(me);
    await this.userService.update(friend);
    res.redirect('/chat/friends');
  }

  @Get('/create/room')
  @Render('create-room')
  async createRoomRender(@Req() req: Request, @Res() res: Response) {
    const authJwt: string = req.cookies.token as string;
    const payload = this.authService.vaildateToken(authJwt);
    if (!payload) {
      res.redirect('/auth/login');
      return;
    }
    const user = await this.userService.findById(payload.id);
    return {
      friends: user.friends,
    };
  }

  @Post('/create/room')
  async createRoom(
    @Req() req: Request,
    @Body('friends') friendsJSON: string,
    @Res() res: Response,
  ) {
    const authJwt: string = req.cookies.token as string;
    const payload = this.authService.vaildateToken(authJwt);
    if (!payload) {
      res.redirect('/auth/login');
      return;
    }
    const user = await this.userService.findById(payload.id);
    const friendIds: number[] = JSON.parse(friendsJSON);
    const members = [];
    user.friends.forEach((friend) => {
      if (friendIds.indexOf(friend.id) != -1) {
        members.push(friend);
      }
    });
    members.push(user);
    await this.roomService.create(members);
    res.redirect('/chat');
  }

  @Get('test')
  async test() {
    const room = await this.roomService.findById(1);
    return { memeber: room.members };
  }
}
