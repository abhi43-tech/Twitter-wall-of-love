import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { Request } from 'express';
import { UserRepository } from '../users/repository/user.repository';
import { CreateWallDto } from './dtos/create.dto';
import { WallSocialLink } from './entity/social-link.entity';
import { UpdateWall } from './dtos/update.dto';
import { ConfigService } from '@nestjs/config';
import { WallRepository } from './repository/wall.repository';
import { ImageUploadService } from '../common/image-upload/image-upload.service';

@Injectable()
export class WallsService {
  constructor(
    private wallRepository: WallRepository,
    private userRepository: UserRepository,
    @InjectRepository(WallSocialLink)
    private socialLinkRepo: Repository<WallSocialLink>,
    private readonly configService: ConfigService,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  async create(req: Request, wall: CreateWallDto, image: Express.Multer.File) {
    const user = await this.userRepository.findByEmail(
      (req.user as User).email,
    );
    if (!user) throw new BadRequestException('User not found');

    let is_public: boolean =
      wall.is_public == undefined
        ? true
        : String(wall.is_public).toLowerCase() === 'true';

    let newWall = this.wallRepository.create({
      ...wall,
      is_public: is_public,
      logo: null,
      user: user,
    });

    if (image?.buffer) {
      newWall.logo = await this.imageUploadService.uploadWallLogo(image.buffer);
    }

    newWall = await this.wallRepository.save(newWall);

    if (wall.social_links && wall.social_links.length > 0) {
      let socialLinksArray: { platform: string; url: string }[];
      if (typeof wall.social_links === 'string') {
        try {
          socialLinksArray = JSON.parse(wall.social_links);
        } catch (e) {
          throw new BadRequestException(
            'social_links must be a valid JSON string',
          );
        }
      } else if (Array.isArray(wall.social_links)) {
        socialLinksArray = wall.social_links;
      } else {
        throw new BadRequestException(
          'social_links must be an array or valid JSON string',
        );
      }

      if (socialLinksArray.length > 0) {
        const socialLinks = await Promise.all(
          socialLinksArray.map(async (link) =>
            this.socialLinkRepo.create({
              platform: link.platform,
              link: link.url,
              wall: newWall,
            }),
          ),
        );
        await this.socialLinkRepo.save(socialLinks);
      }
    }

    return {
      wall_id: newWall.id,
      message: 'Wall created successfully.',
    };
  }

  async get(req: Request) {
    const user = await this.userRepository.getUserId((req.user as User).email);
    const walls = await this.wallRepository.find({
      where: { user: user },
      relations: ['socialLinks'],
    });

    return walls;
  }

  async getById(req: Request, id: number) {
    const user = await this.userRepository.getUserId((req.user as User).email);
    const wall = await this.wallRepository.getWithAllRelation(id);

    if (!wall) throw new NotFoundException('Wall not found.');
    if (user.id !== wall.user.id && !wall.is_public) {
      throw new BadRequestException('Wall is not accessible.');
    }

    const response = await this.wallRepository.findOne({
      where: { id: wall.id },
      relations: ['tweets', 'socialLinks'],
    });

    return response;
  }

  async delete(id: number, req) {
    const wall = await this.wallRepository.getWithUserAndLinks(id);
    if (!wall) throw new NotFoundException('Wall is found.');

    const user = await this.userRepository.getUserId(req.user.email);
    if (wall.user.id != user.id) {
      throw new BadRequestException('Not allowed to delete this  wall.');
    }
    const wallLogo = wall.logo ? wall.logo : false;
    if (wallLogo != '' || wallLogo) {
      await this.imageUploadService.deleteWallLogo(wall.logo);
    }

    await this.wallRepository.remove(wall);

    return { message: 'Wall deleted successfully.' };
  }

  async update(req, id: number, data: UpdateWall, image: Express.Multer.File) {
    const wall = await this.wallRepository.getWithUserAndLinks(id);
    if (!wall) throw new NotFoundException('Wall not found.');

    const user = await this.userRepository.getUserId(req.user.email);
    if (wall.user.id !== user.id) {
      throw new BadRequestException('Not allowed to update this wall.');
    }

    if (image?.buffer) {
      if (wall?.logo) {
        await this.imageUploadService.deleteWallLogo(wall.logo);
      }
      wall.logo = await this.imageUploadService.uploadWallLogo(image.buffer);
    }

    data.is_public =
      data.is_public == undefined
        ? wall.is_public
        : String(data.is_public).toLowerCase() === 'true';
    Object.assign(wall, data);
    await this.wallRepository.save(wall);

    if (data.social_links && data.social_links.length > 0) {
      let socialLinksArray: { platform: string; link: string }[];
      if (typeof data.social_links === 'string') {
        try {
          socialLinksArray = JSON.parse(data.social_links);
        } catch (e) {
          throw new Error('social_links must be a valid JSON string');
        }
      } else if (Array.isArray(data.social_links)) {
        socialLinksArray = data.social_links;
      } else {
        throw new Error('social_links must be an array or valid JSON string');
      }

      if (socialLinksArray.length > 0) {
        for (const link of socialLinksArray) {
          const existingLink = wall.socialLinks.find(
            (socialLink) => socialLink.platform === link.platform,
          );

          if (existingLink) {
            existingLink.link = link.link;
            await this.socialLinkRepo.save(existingLink);
          } else {
            const newSocialLink = this.socialLinkRepo.create({
              platform: link.platform,
              link: link.link,
              wall,
            });
            await this.socialLinkRepo.save(newSocialLink);
          }
        }
      }
    }

    const response = await this.wallRepository.findOne({
      where: { id: wall.id },
      relations: ['socialLinks'],
    });

    return response;
  }

  async getPublicWalls(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.wallRepository.find({
      where: { user: { id: user.id }, is_public: true },
      relations: ['socialLinks'],
    });
  }

  async deleteSocialLink(req: Request, linkId: number, wallId: number) {
    const wall = await this.wallRepository.getWithUser(wallId);
    const link = await this.socialLinkRepo.findOne({
      where: { id: linkId, wall: { id: wallId } },
    });

    if (!wall) throw new NotFoundException('wall is not found.');
    if (!link) throw new NotFoundException('Link is not found.');
    if ((wall.user as any).email != (req.user as User).email)
      throw new BadRequestException('Only owner can delete links.');

    await this.socialLinkRepo.remove(link);
    return { Message: 'Link is deleted' };
  }

  async getPublicSharableLink(req, wallId: number): Promise<{ link: string }> {
    const user = await this.userRepository.findOne({
      where: { email: req.user.email },
      select: ['id'],
    });
    const wall = await this.wallRepository.findOne({
      where: { id: wallId },
      relations: ['user'],
    });

    if (!wall) throw new NotFoundException('Wall not found.');
    if (user.id != wall.user.id) {
      throw new BadRequestException('Only owner can generate public link.');
    }

    wall.sharable = true;
    await this.wallRepository.save(wall);

    const baseUrl = this.configService.get<string>('APP_URL');
    const shareLink = `${baseUrl}/walls/${wallId}/public`;
    return { link: shareLink };
  }

  async getWallForLink(id: number) {
    const wall = await this.wallRepository.findOne({
      where: { id },
      relations: ['tweets', 'socialLinks'],
      order: { tweets: { order: 'ASC' } },
    });

    if (!wall.sharable)
      throw new BadRequestException('Acces is not allowed via Link.');
    return wall;
  }

  async getEmbedCode(req, wallId: number): Promise<{ embedCode: string }> {
    const user = await this.userRepository.findOne({
      where: { email: req.user.email },
      select: ['id'],
    });
    const wall = await this.wallRepository.findOne({
      where: { id: wallId },
      relations: ['user'],
    });

    if (!wall) throw new NotFoundException('Wall not found.');
    if (user.id !== wall.user.id) {
      throw new BadRequestException(
        'Only the owner can generate an embed code.',
      );
    }
    if (!wall.sharable) {
      wall.sharable = true;
      await this.wallRepository.save(wall);
    }

    const baseUrl = this.configService.get<string>('APP_URL');
    const embedUrl = `${baseUrl}/walls/${wallId}/public`;
    const embedCode = `<iframe src="${embedUrl}" width="70%" height="400"></iframe>`;
    return { embedCode };
  }
}
