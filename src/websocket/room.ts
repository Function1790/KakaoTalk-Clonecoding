import { ChatClient } from './client';

type Client = ChatClient;

export class Room extends Set<Client> {
  constructor(public roomId: string) {
    super();
  }

  join(client: Client) {
    this.add(client);
    this.emit(client, 'message', { message: '[System] Join' });
  }

  leave(client: Client) {
    this.delete(client);
    this.emit(client, 'message', { message: '[System] leave' });
  }

  emit(from: Client, event: string, data) {
    console.log('sended:', data);
    this.forEach((client) => {
      client.emit(event, data);
    });
  }
}

export class RoomManager extends Map<string, Room> {
  send(from: Client, message: string) {
    const room = this.get(from.data.roomId);
    room.emit(from, 'message', { message });
  }

  getRoom(roomId: string): Room {
    if (!this.has(roomId)) {
      const room = new Room(roomId);
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
