import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TweetService } from './tweets.service';
import { JwtGuard } from '../common/auth/guard/jwt.guard';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@ApiParam({
  name: 'wallId',
  description: 'Enter wall ID',
  required: true,
  type: Number,
})
@UseGuards(JwtGuard)
@Controller('walls/:wallId/tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @ApiBody({
    description: 'Tweet URL',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://twitter.com/user/status/1234567890123456789',
        },
      },
    },
    required: true,
    type: String,
  })
  @Post()
  async create(
    @Request() req,
    @Body('url') tweetURL: string,
    @Param('wallId') wallId: number,
  ) {
    return await this.tweetService.create(req, tweetURL, wallId);
  }

  @Get()
  async get(@Request() req, @Param('wallId') wallId: number) {
    return await this.tweetService.get(req, wallId);
  }

  @ApiParam({
    name: 'tweetId',
    description: 'Enter tweet ID',
    required: true,
    type: Number,
  })
  @Delete(':tweetId')
  async delete(
    @Request() req,
    @Param('wallId') wallId: number,
    @Param('tweetId') tweetId: number,
  ) {
    return await this.tweetService.delete(req, wallId, tweetId);
  }

  @Patch('reorder')
  async reorder(
    @Request() req,
    @Param('wallId') wallId: number,
    @Body() orderData?: { tweetId: number; order: number }[],
  ) {
    return await this.tweetService.reorder(req, wallId, orderData);
  }
}
