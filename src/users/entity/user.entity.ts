import { Wall } from '../../walls/entity/wall.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: true })
  twitter_id: number;

  @Column({ nullable: true }) 
  profile_pic: string;

  @Column({ nullable: true, unique: true })
  api_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Wall, (wall) => wall.user, {
    cascade: true,
  })
  walls: Wall[];
}