import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { Wall } from './walls/entity/wall.entity';
import { Tweet } from './tweets/entity/tweet.entity';
import { UsersModule } from './users/users.module';
import { WallsModule } from './walls/walls.module';
import { AuthModule } from './common/auth/auth.module';
import { WallSocialLink } from './walls/entity/social-link.entity';
import { TweetModule } from './tweets/tweets.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
      ScheduleModule.forRoot(),
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        database: 'twitter',
        username: 'root',
        password: '',
        entities: [User, Wall, Tweet, WallSocialLink],
        synchronize: true,
    }),
    UsersModule,
    WallsModule,
    AuthModule,
    TweetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
