import { IsBoolean, IsOptional, IsString, ValidateNested, IsArray } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class SocialLinkDto {
  @ApiProperty({
    description: 'Platform of social link',
    example: 'instagram',
    type: String,
  })
  @IsString()
  platform: string;

  @ApiProperty({
    description: 'Llink of social platform',
    example: 'instagram/user.com',
    type: String,
  })
  @IsString()
  link: string;
}

export class UpdateWall {
  @ApiProperty({
    description: 'Title of the wall',
    example: 'NestJS',
    type: String,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of wall',
    example: 'Progressive app framework for node.js',
    type: String,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Wall visibility',
    example: 'false',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'false' ? false : true)
  @IsBoolean()
  is_public: boolean;

 @ApiProperty({
     description: 'social links with platform',
     example: [{ platofrm: 'instagram', url: 'instagram.com' }],
     type: Array<SocialLinkDto>,
   })
   @IsOptional()
   @Transform(
     ({ value }) => {
       if (typeof value === 'string') {
         try {
           return JSON.parse(value);
         } catch (e) {
           throw new Error('social_links must be a valid JSON string');
         }
       }
       return value;
     },
     { toClassOnly: true },
   ) // Ensure transform runs before validation
   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => SocialLinkDto)
   social_links?: SocialLinkDto[];
}
