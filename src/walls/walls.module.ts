import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wall } from './entity/wall.entity';
import { WallsController } from './controller/walls.controller';
import { UserRepository } from '../users/repository/user.repository';
import { PublicWallsController } from './controller/public-wall.controller';
import { WallsService } from './walls.service';
import { WallSocialLink } from './entity/social-link.entity';
import { WallRepository } from './repository/wall.repository';
import { ImageUploadService } from '../common/image-upload/image-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wall, WallSocialLink])],
  controllers: [WallsController, PublicWallsController],
  providers: [WallsService, UserRepository, WallRepository, ImageUploadService],
})
export class WallsModule {}
