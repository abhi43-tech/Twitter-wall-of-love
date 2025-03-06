import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Tweet } from '../entity/tweet.entity';

@Injectable()
export class TweetRepository extends Repository<Tweet> {
  constructor(private dataSource: DataSource) {
    super(Tweet, dataSource.createEntityManager());
  }
}
