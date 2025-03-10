import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { CreateWallDto } from '../dtos/create.dto';
import { JwtGuard } from '../../common/auth/guard/jwt.guard';
import { UpdateWall } from '../dtos/update.dto';
import { WallsService } from '../walls.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam } from '@nestjs/swagger';

@Controller('walls')
export class WallsController {
  constructor(private readonly wallsService: WallsService) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Req() req,
    @Body() wall: CreateWallDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    image: Express.Multer.File,
  ) {
    return await this.wallsService.create(req, wall, image);
  }

  @UseGuards(JwtGuard)
  @Get()
  async get(@Request() req) {
    return await this.wallsService.get(req);
  }

  @ApiParam({
    name: 'wallId',
    description: 'Enter wall ID',
    required: true,
    type: Number,
  })
  @UseGuards(JwtGuard)
  @Get(':wallId')
  async getById(@Request() req, @Param('wallId') id: number) {
    return await this.wallsService.getById(req, id);
  }

  @ApiParam({
    name: 'wallId',
    description: 'Enter wall ID',
    required: true,
    type: Number,
  })
  @UseGuards(JwtGuard)
  @Put(':wallId')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Req() req,
    @Param('wallId') id: number,
    @Body() data: UpdateWall,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    image: Express.Multer.File,
  ) {
    return await this.wallsService.update(req, id, data, image);
  }

  @ApiParam({
    name: 'wallId',
    description: 'Enter wall ID',
    required: true,
    type: Number,
  })
  @UseGuards(JwtGuard)
  @Delete(':wallId')
  async delete(@Param('wallId') id: number, @Request() req) {
    return await this.wallsService.delete(id, req);
  }

  @ApiParam({
    name: 'wallId',
    description: 'Enter wall ID',
    required: true,
    type: Number,
  })
  @ApiParam({
    name: 'linkId',
    description: 'Enter social link ID',
    required: true,
    type: Number,
  })
  @UseGuards(JwtGuard)
  @Delete(':wallId/social-links/:linkId')
  async deleteSocialLink(
    @Request() req,
    @Param('linkId') linkId: number,
    @Param('wallId') wallId: number,
  ) {
    return await this.wallsService.deleteSocialLink(req, linkId, wallId);
  }

  @ApiParam({
    name: 'wallId',
    description: 'Enter wall ID',
    required: true,
    type: Number,
  })
  @UseGuards(JwtGuard)
  @Get(':wallId/sharable-link')
  async getSharableLink(
    @Req() req,
    @Param('wallId') id: number,
  ): Promise<{ link: string }> {
    return await this.wallsService.getPublicSharableLink(req, id);
  }

  @ApiParam({
    name: 'wallId',
    description: 'Enter wall ID',
    required: true,
    type: Number,
  })
  @Get(':wallId/public')
  async getWallByLink(@Param('wallId') id: number) {
    return await this.wallsService.getWallForLink(id);
  }

  @ApiParam({
    name: 'wallId',
    description: 'Enter wall ID',
    required: true,
    type: Number,
  })
  @UseGuards(JwtGuard)
  @Get(':wallId/embed-code')
  async getEmbedCode(
    @Req() req,
    @Param('wallId') id: number,
  ): Promise<{ embedCode: string }> {
    return await this.wallsService.getEmbedCode(req, id);
  }
}
