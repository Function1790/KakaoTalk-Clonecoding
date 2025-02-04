import { User } from 'src/auth/entity/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @OneToMany(() => ChatMessage, (message) => message.room)
  messages: ChatMessage[];
}
