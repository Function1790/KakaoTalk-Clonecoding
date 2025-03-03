import { ChatClient } from './client';

type Client = ChatClient;

interface Packet {
  from: string;
  message: string;
}

export class Room extends Set<Client> {
  constructor(public roomId: string) {
    super();
  }

  join(client: Client) {
    this.add(client);
    this.emit(client, 'message', {
      from: 'system',
      message: `${client.data.name}님이 들어오셨습니다`,
    });
  }

  leave(client: Client) {
    this.delete(client);
    this.emit(client, 'message', {
      from: 'system',
      message: `${client.data.name}님이 나갔습니다`,
    });
  }

  emit(from: Client, event: string, data: Packet) {
    console.log('sended:', data);
    this.forEach((client) => {
      if (data.from == client.data.name) {
        data.from = 'me';
      }
      client.emit(event, data);
    });
  }
}

export class RoomManager extends Map<string, Room> {
  send(from: Client, message: string) {
    const room = this.get(from.data.roomId);
    room.emit(from, 'message', {
      from: from.data.name,
      message,
    });
  }

  getRoom(roomId: string): Room {
    if (!this.has(roomId)) {
      const room = new Room(roomId);
      console.log(`[System] >> new room created (roomId:${roomId})`);
      this.set(roomId, room);
      return room;
    } else {
      return this.get(roomId);
    }
  }

  join(roomId: string, client: Client) {
    this.getRoom(roomId).join(client);
  }

  leave(roomId: string, client: Client): Room {
    if (!this.has(roomId)) return;
    const room = this.get(roomId);
    room.leave(client);
    return room;
  }
}
