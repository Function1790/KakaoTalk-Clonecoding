import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { parse } from 'cookie';
import { verifyToken } from './jwt.decode';
import { ChatClient, ClientData } from './client';
import { Logger } from '@nestjs/common';
import { RoomManager } from './room';

// TODO: Provider로 승급 후 Controller에서 이용
@WebSocketGateway({ cors: { origin: '*' } }) // CORS 설정
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('EventsGateway');
  private rooms = new RoomManager();

  afterInit() {
    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  // 클라이언트 연결 시 실행 (쿠키 출력)
  handleConnection() {}

  verify(cookieString: string) {
    const jwtString = parse(cookieString)?.token;
    if (!jwtString) return;
    const payload = verifyToken(jwtString);
    if (!payload) return;
    //this.logger.log('Payload:', payload);
    return payload;
  }

  // 초기화
  @SubscribeMessage('init')
  handleInit(
    @ConnectedSocket() client: ChatClient,
    @MessageBody() data: { message: string; roomid: string },
  ) {
    const roomId = data.roomid;
    // TODO: DB에 room이 존재하지 않을 경우
    // 인증
    const cookieString = data.message || '';
    const payload = this.verify(cookieString);
    if (!payload) {
      client.emit('error', '인가되지 않은 토큰입니다. 다시 로근인 해주세요.');
      return;
    }
    client.data = payload as ClientData;
    client.data.roomId = roomId;
    this.rooms.join(roomId, client);
    this.logger.log(
      `🔥 Client connected: ${client.data.name} [roomId: ${roomId}]`,
    );
  }

  handleDisconnect(@ConnectedSocket() client: ChatClient) {
    const roomId = client.data.roomId;
    this.rooms.leave(roomId, client);
    this.logger.log(`🔥 Client disconnected: ${client.data.name}`);
  }

  // 채팅
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: ChatClient,
    @MessageBody() data: { message: string },
  ) {
    // TODO: 인가되지 않은 유저가 접근할 경우
    this.rooms.send(client, data.message);
  }
}
