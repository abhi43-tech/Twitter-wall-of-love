import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../../users/repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const access_token = req.cookies?.Access;
          if (access_token) return access_token;

          return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        },
      ]),
      ignoreExpiration: false,
      secretOrKeyProvider: async (
        request: Request,
        rawJwtToken: string,
        done: (err: any, secret: string) => void,
      ) => {
        const accessSecret = this.configService.get<string>('JWT_ACCESS_TOKEN');
        const apiSecret = this.configService.get<string>('JWT_API_SECRET');

        const decoded = this.jwtService.decode(rawJwtToken);
        if (!decoded?.email) {
          return done(
            new UnauthorizedException(
              'Invalid token: email field is missing or token is invalid.',
            ),
            null,
          );
        }

        const user = await this.userRepository.findOne({
          where: { email: decoded.email },
        });
        if (user?.api_token === rawJwtToken) {
          console.log('api call...');
          return done(null, apiSecret);
        }

        return done(null, accessSecret);
      },
    });
  }

  async validate(payload: any) {
    return {
      email: payload.email,
    };
  }
}
