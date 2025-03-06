import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { AuthService } from "../common/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "./mail-sender/mail.service";
import { UserRepository } from "./repository/user.repository";
import { ImageUploadService } from "../common/image-upload/image-upload.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [ UsersService, AuthService, JwtService, MailService, UserRepository, ImageUploadService],
  controllers: [UsersController],
  exports: [UserRepository]
})
export class UsersModule {}