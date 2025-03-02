import { Server } from 'socket.io';
import { Payload } from 'src/auth/security/payload.interface';

export class ChatClient extends Server {
  data: ClientData;
}

export interface ClientData extends Payload {
  roomId: string;
}
