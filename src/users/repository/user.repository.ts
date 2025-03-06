import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getUserId(email: string) {
    return await this.findOne({
      where: { email },
      select: ['id'],
    });
  }

  async findByEmail(email: string) {
    return await this.findOne({
      where: { email },
    });
  }
}
