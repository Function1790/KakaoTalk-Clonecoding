import { Room } from 'src/room/entity/room.eneity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @ManyToMany(() => Room, (room) => room.members)
  rooms: Room[];

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];
}
