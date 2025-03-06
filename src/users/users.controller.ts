import {
  Body,
  Controller,
  Post,
  UseGuards,
  Response,
  Request,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { LoginGuard } from '../common/auth/guard/login.guard';
import { JwtGuard } from '../common/auth/guard/jwt.guard';
import { UpdateUser } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ResetPasswordDto,
  ResetPasswordRequestDto,
} from './dtos/reset-pass.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('image'))
  async signup(
    @Body() user: CreateUserDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    image: Express.Multer.File,
    @Response() res,
  ) {
    await this.userService.create(user, image);
    return res.json({ message: 'User created successfully.' });
  }

  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Body() user: LoginDto, @Request() req, @Response() res) {
    const token = await this.userService.login(user, res);
    res.json({ token: token });
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Response() res) {
    res.clearCookie('Access');
    return res.json({ message: 'Logged out successfully.' });
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Put()
  async update(
    @Request() req,
    @Body() user: UpdateUser,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    image: Express.Multer.File,
  ) {
    return await this.userService.update(req, user, image);
  }

  @UseGuards(JwtGuard)
  @Delete()
  async delete(@Request() req, @Response() res) {
    res.clearCookie('Access');
    await this.userService.delete(req);
    return res.json({ message: 'User deleted successfully.' });
  }

  @Post('reset-password/request')
  async requestResetPassword(@Body() email: ResetPasswordRequestDto) {
    await this.userService.sendResetPassEmail(email);
    return { message: 'Email was sent.' };
  }

  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    await this.userService.resetPassword(data);
    return { message: 'Password updated successfully.' };
  }

  @UseGuards(JwtGuard)
  @Post('generate-api-token')
  async generateApiToken(@Request() req): Promise<{ apiToken: string }> {
    return await this.userService.generateApiToken(req);
  }
}
