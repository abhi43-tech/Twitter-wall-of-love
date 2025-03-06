import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Wall } from '../entity/wall.entity';

@Injectable()
export class WallRepository extends Repository<Wall> {
  constructor(private dataSource: DataSource) {
    super(Wall, dataSource.createEntityManager());
  }

  async getWithUser(wallId: number) {
    return await this.findOne({
      where: { id: wallId },
      relations: ['user'],
    });
  }

  async getWithUserAndLinks(wallId: number) {
    return await this.findOne({
      where: { id: wallId },
      relations: ['user', 'socialLinks'],
    });
  }

  async getWithAllRelation(id: number) {
    return await this.findOne({
      where: { id },
      relations: ['socialLinks', 'tweets', 'user'],
    });
  }
}
