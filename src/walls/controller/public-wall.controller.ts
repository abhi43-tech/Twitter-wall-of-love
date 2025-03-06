import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WallsService } from '../walls.service';
import { JwtGuard } from '../../common/auth/guard/jwt.guard';

@Controller('users/:userId/walls')
export class PublicWallsController {
  constructor(private readonly wallsService: WallsService) {}

  @UseGuards(JwtGuard)
  @Get('public')
  getPublicWalls(@Param('userId') userId: number) {
    return this.wallsService.getPublicWalls(userId);
  }
}
