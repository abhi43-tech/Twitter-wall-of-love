import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Wall } from '../../walls/entity/wall.entity';

@Entity()
export class WallSocialLink {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wall, (wall) => wall.socialLinks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wall_id', referencedColumnName: 'id' })
  wall: Wall;

  @Column({ type: 'enum', enum: ['twitter', 'instagram', 'facebook', 'linkedin', 'youtube'] })
  platform: string;

  @Column({ type: 'varchar', length: 500 })
  link: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
