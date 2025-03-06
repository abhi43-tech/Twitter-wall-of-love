import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/signup.dto';
import { User } from './entity/user.entity';
import { LoginDto } from './dtos/login.dto';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { UpdateUser } from './dtos/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../common/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  ResetPasswordDto,
  ResetPasswordRequestDto,
} from './dtos/reset-pass.dto';
import { MailService } from './mail-sender/mail.service';
import { ImageUploadService } from '../common/image-upload/image-upload.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  async create(user: CreateUserDto, image: Express.Multer.File): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: user.email }, { name: user.name }],
    });

    if (existingUser) {
      throw new BadRequestException(
        'User with this email or username already exists.',
      );
    }
    const hashPass = await bcrypt.hash(user.password, 10);
    let newUser = await this.userRepository.create({
      ...user,
      password: hashPass,
    });

    if (image?.buffer) {
      const profilePicURL = await this.imageUploadService.uploadUserImage(
        image.buffer,
      );
      newUser.profile_pic = profilePicURL;
    }

    await this.userRepository.save(newUser);
  }

  async login(user: LoginDto, res) {
    const { access_token } = await this.authService.getToken(user);

    res.cookie('Access', access_token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 60 * 60 * 1000,
    });

    return access_token;
  }

  async update(req: Request, data: UpdateUser, image?: Express.Multer.File) {
    const user = await this.userRepository.findByEmail(
      (req.user as User).email,
    );
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (image?.buffer) {
      if (user?.profile_pic) {
        await this.imageUploadService.deleteUserImage(user.profile_pic);
      }

      const profilePicURL = await this.imageUploadService.uploadUserImage(
        image.buffer,
      );
      user.profile_pic = profilePicURL;
    }

    Object.assign(user, data);
    await this.userRepository.save(user);
    return {
      name: user.name,
      email: user.email,
      profile_pic: user.profile_pic,
    };
  }

  async delete(req: Request): Promise<void> {
    const user = await this.userRepository.findByEmail(
      (req.user as User).email,
    );
    if (!user) {
      throw new NotFoundException('Email not registered.');
    }

    if (user?.profile_pic) {
      await this.imageUploadService.deleteUserImage(user.profile_pic);
    }

    await this.userRepository.remove(user);
  }

  async sendResetPassEmail(request: ResetPasswordRequestDto) {
    const user = await this.userRepository.findOne({
      where: { email: request.email },
    });
    if (!user) throw new UnauthorizedException('Email not registered.');

    const token = await this.jwtService.sign(request, {
      secret: this.configService.get<string>('JWT_RESET_TOKEN'),
      expiresIn: '15m',
    });

    await this.mailService.sendMail({
      email: request.email,
      subject: 'Reset Password',
      text: token,
    });

    return token;
  }

  async resetPassword(request: ResetPasswordDto): Promise<void> {
    const { email } = await this.jwtService.verify(request.token, {
      secret: this.configService.get<string>('JWT_RESET_TOKEN'),
    });

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email not registered.');

    user.password = await bcrypt.hash(request.password, 10);
    await this.userRepository.save(user);
  }

  async generateApiToken(req: Request): Promise<{ apiToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email: (req.user as User).email },
    });
    if (!user) throw new BadRequestException('User not found.');

    const payload = { email: user.email };
    const apiToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_API_SECRET'),
      expiresIn: '1y',
    });

    user.api_token = apiToken;
    await this.userRepository.save(user);

    return { apiToken };
  }
}
