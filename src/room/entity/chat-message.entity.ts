import { User } from 'src/auth/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Room } from './room.eneity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  sender: User;

  @ManyToOne(() => Room, (room) => room.messages, { onDelete: 'CASCADE' })
  room: Room;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
