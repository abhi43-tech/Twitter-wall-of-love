import { Wall } from '../../walls/entity/wall.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tweet_id: string;

  @Column()
  author_id: string;

  @Column()
  author_name: string;

  @Column({ nullable: true })
  profile_pic: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  comments: number;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @UpdateDateColumn()
  last_sync_at: Date;

  @ManyToOne(() => Wall, (wall) => wall.tweets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wall_id', referencedColumnName: 'id' })
  wall: Wall;
}
