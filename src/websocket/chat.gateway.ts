import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { verifyToken } from './jwt.decode';
import { Logger } from '@nestjs/common';
import { Payload } from 'src/auth/security/payload.interface';

class ChatClient extends Server {
  data: Payload;
}

@WebSocketGateway({ cors: { origin: '*' } }) // CORS 설정
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('EventsGateway');

  afterInit() {
    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  // 클라이언트 연결 시 실행 (쿠키 출력)
  handleConnection(client: Socket) {
    const username = `User-${client.id.slice(0, 5)}`;
    this.logger.log(`Client connected: ${client.id} as ${username}`);
  }

  // 메시지 핑퐁 처리
  @SubscribeMessage('cookie')
  handleCookie(
    @ConnectedSocket() client: ChatClient,
    @MessageBody() data: { message: string },
  ) {
    const cookieString = data.message || '';
    const jwtString = parse(cookieString)?.token;
    if (!jwtString) return;
    const payload = verifyToken(jwtString);
    if (!payload) return;
    console.log('Payload:', payload);
    client.data = payload as Payload;
  }
  // 메시지 핑퐁 처리리
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: ChatClient,
    @MessageBody() data: { message: string },
  ) {
    console.log(`Received: ${data.message}`);
    this.server.emit('message', {
      message: `${client.data.name} said: ${data.message}`,
    });
  }
}
