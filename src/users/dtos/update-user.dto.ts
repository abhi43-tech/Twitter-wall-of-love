import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUser {
  @ApiProperty({
    description: 'Your name',
    example: 'John',
    type: String,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Email address',
    example: 'abc@gmail.com',
    type: String,
  })
  @IsEmail()
  @IsOptional()
  email: string;
}
