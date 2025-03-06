import { Tweet } from '../../tweets/entity/tweet.entity';
import { User } from '../../users/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WallSocialLink } from './social-link.entity';

@Entity()
export class Wall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ default: true })
  is_public: boolean;

  @Column({ default: false })
  sharable: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.walls, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => WallSocialLink, (socialLink) => socialLink.wall, {
    cascade: true,
  })
  socialLinks: WallSocialLink[];

  @OneToMany(() => Tweet, (tweet) => tweet.wall, {
    cascade: true,
  })
  tweets: Tweet[];
}
