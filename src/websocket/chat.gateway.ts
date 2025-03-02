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
import { ChatClient, ClientData } from './client';
import { Logger } from '@nestjs/common';
import { RoomManager } from './room';

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
  handleConnection(client: Socket) {
    const username = `User-${client.id.slice(0, 5)}`;
    this.logger.log(`Client connected: ${client.id} as ${username}`);
  }

  verify(cookieString: string) {
    const jwtString = parse(cookieString)?.token;
    if (!jwtString) return;
    const payload = verifyToken(jwtString);
    if (!payload) return;
    console.log('Payload:', payload);
    return payload;
  }

  // 초기화
  @SubscribeMessage('init')
  handleInit(
    @ConnectedSocket() client: ChatClient,
    @MessageBody() data: { message: string; url: string },
  ) {
    const roomId = '1';
    // 인증
    const cookieString = data.message || '';
    const payload = this.verify(cookieString);
    if (!payload) return;
    client.data = payload as ClientData;
    client.data.roomId = roomId;
    this.rooms.join(roomId, client);
    console.log(`🔥 Client connected: ${client.data.name}`);
  }

  handleDisconnect(@ConnectedSocket() client: ChatClient) {
    const roomId = client.data.roomId;
    this.rooms.leave(roomId, client);
    console.log(`🔥 Client disconnected: ${client.data.name}`);
  }

  // 채팅
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: ChatClient,
    @MessageBody() data: { message: string },
  ) {
    console.log(`Received: ${data.message}`);
    this.rooms.send(client, `${client.data.name} said: ${data.message}`);
  }
}
