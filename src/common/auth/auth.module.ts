import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginStrategy } from './strategy/login.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserRepository } from '../../users/repository/user.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'twitter' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN'),
        signOptions: { expiresIn: '2m' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, LoginStrategy, JwtStrategy, UserRepository],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
