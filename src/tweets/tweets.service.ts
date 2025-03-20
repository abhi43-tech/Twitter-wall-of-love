import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Tweet } from './entity/tweet.entity';
import { Request } from 'express';
import { User } from '../users/entity/user.entity';
import { UserRepository } from '../users/repository/user.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WallRepository } from '../walls/repository/wall.repository';
import { TweetRepository } from './repository/tweet.repository';
import { In } from 'typeorm';

@Injectable()
export class TweetService {
  private readonly TWITTER_API_URL = 'https://api.twitter.com/2/tweets/';
  private readonly token: string;

  constructor(
    private configService: ConfigService,
    private wallRepo: WallRepository,
    private tweetRepo: TweetRepository,
    private userRepo: UserRepository,
  ) {
    this.token = this.configService.get<string>('BEARER_TOKEN');
  }

  async create(req: Request, tweetURL: string, wallId: number) {
    if (!this.token) {
      throw new BadRequestException('Twitter API Bearer Token is missing');
    }

    const match = tweetURL.match(/\/status\/(\d+)/);
    if (!match) throw new BadRequestException('Invalid tweet URL.');
    const tweetId = match[1];

    try {
      const wall = await this.wallRepo.getWithUser(wallId);
      if (!wall) throw new BadRequestException('Wall not found.');

      if (wall.user.email != (req.user as User).email)
        throw new BadRequestException('Only Owner can create Tweets.');

      // const request = `${this.TWITTER_API_URL}${tweetId}?expansions=author_id&tweet.fields=public_metrics&user.fields=profile_image_url`;
      // const response = await axios.get(request, {
      //   headers: {
      //     Authorization: `Bearer ${this.token}`,
      //   },
      // });

      // const tweetData = response.data.data;
      // const userData = response.data.includes.users;

      const tweetCount = await this.tweetRepo.count({
        where: { wall: { id: wallId } },
      });

      // const tweet = this.tweetRepo.create({
      //   tweet_id: tweetData.id,
      //   author_id: userData[0].id,
      //   author_name: userData[0].username,
      //   profile_pic: userData[0].profile_image_url,
      //   content: tweetData.text,
      //   likes: tweetData.public_metrics.like_count,
      //   comments: tweetData.public_metrics.reply_count,
      //   order: tweetCount,
      //   wall: wall,
      // });
      const tweet = this.tweetRepo.create({
        tweet_id: '1',
        author_id: 'wall',
        author_name: 'wall',
        content: 'tweet',
        likes: Math.random() * 1000,
        comments: 122,
        order: tweetCount,
        wall: wall,
      });

      const newTweet = await this.tweetRepo.save(tweet);
      return await this.tweetRepo.findOne({ where: { id: newTweet.id } });
    } catch (error) {
      throw new BadRequestException(
        `Error: ${error.response?.data?.error || error.message}`,
      );
    }
  }

  async get(req: Request, wallId: number): Promise<string | Tweet[]> {
    const wall = await this.wallRepo.getWithUser(wallId);
    if (!wall) {
      throw new NotFoundException('Wall is not found.');
    }

    if (wall.user.email !== (req.user as User).email && !wall.is_public) {
      throw new BadRequestException('Tweets are not accessible.');
    }
    return await this.tweetRepo.find({
      where: { wall: { id: wall.id } },
      order: { order: 'ASC' },
    });
  }

  async delete(req: Request, wallId: number, tweetId: number): Promise<string> {
    const tweet = await this.tweetRepo.findOne({
      where: { id: tweetId },
      relations: ['wall'],
    });
    if (!tweet || tweet.wall.id != wallId) {
      throw new NotFoundException('Tweet not found.');
    }

    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.walls', 'wall')
      .where('user.email = :email', { email: (req.user as User).email })
      .andWhere('wall.id = :wallId', { wallId: tweet.wall.id })
      .getOne();

    if (user) {
      await this.tweetRepo.remove(tweet);
      return 'Tweet is deleted.';
    }
    return 'Only the owner can remove tweet.';
  }

  async reorder(
    req,
    wallId: number,
    orderData?: { id: number; order: number }[],
  ): Promise<Tweet[]> {
    const wall = await this.wallRepo.getWithUser(wallId);
    if (!wall) throw new NotFoundException('Wall not found.');
    if (wall.user.email !== (req.user as User).email) {
      throw new BadRequestException('Only the owner can reorder tweets.');
    }

    if (!Array.isArray(orderData) || orderData.length === 0) {
      return await this.randomOrder(req, wallId);
    }

    // Fetch all tweets by their IDs
    const tweetIds = orderData.map((data) => data.id);
    const tweets = await this.tweetRepo.find({
      where: { id: In(tweetIds) },
    });

    // Update order values in memory
    const updatedTweets = tweets.map((tweet) => {
      const newOrder = orderData.find((t) => t.id === tweet.id)?.order;
      return { ...tweet, order: newOrder };
    });

    // Save all at once
    await this.tweetRepo.save(updatedTweets);

    // Return updated tweets sorted by order
    return await this.tweetRepo.find({
      where: { wall: { id: wallId } },
      order: { order: 'ASC' },
    });
  }

  async randomOrder(req: Request, wallId: number) {
    const tweets = await this.get(req, wallId);

    if (typeof tweets === 'string') {
      throw new BadRequestException(tweets);
    }

    for (let i = tweets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tweets[i], tweets[j]] = [tweets[j], tweets[i]];
    }

    tweets.forEach((tweet, index) => {
      tweet.order = index;
    });
    await this.tweetRepo.save(tweets);

    return tweets;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateTweetMetrics() {
    const tweets = await this.tweetRepo.find();
    for (const tweet of tweets) {
      const response = await axios.get(
        `${this.TWITTER_API_URL}${tweet.tweet_id}?tweet.fields=public_metrics`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );
      tweet.likes = response.data.data.public_metrics.like_count;
      tweet.comments = response.data.data.public_metrics.reply_count;

      await this.tweetRepo.save(tweet);
    }
  }
}
