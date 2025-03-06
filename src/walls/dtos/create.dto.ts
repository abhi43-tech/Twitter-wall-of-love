import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SocialLinkDto {
  @ApiProperty({
    description: 'Platform of social link',
    example: 'instagram',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  platform: string;

  @ApiProperty({
    description: 'Llink of social platform',
    example: 'instagram/user.com',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateWallDto {
  @ApiProperty({
    description: 'Title of the wall',
    example: 'NestJS',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of wall',
    example: 'Progressive app framework for node.js',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Wall visibility',
    example: 'false',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => (value === 'false' ? false : true))
  @IsBoolean()
  is_public?: boolean = true;

  @ApiProperty({
    description: 'social links with platform',
    example: [{platofrm: 'instagram', url: 'instagram.com'}],
    type: Array<SocialLinkDto>,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  social_links: SocialLinkDto[];
}
