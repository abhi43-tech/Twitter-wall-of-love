import { Module } from "@nestjs/common";
import { TweetService } from "./tweets.service";
import { TweetController } from "./tweets.controller";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tweet } from "./entity/tweet.entity";
import { UserRepository } from "../users/repository/user.repository";
import { WallRepository } from "../walls/repository/wall.repository";
import { TweetRepository } from "./repository/tweet.repository";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Tweet])],
  providers: [TweetService, UserRepository, WallRepository, TweetRepository],
  controllers: [TweetController],
})
export class TweetModule {}