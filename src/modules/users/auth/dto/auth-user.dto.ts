import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({
    description: 'email',
    example: 'yourmail@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password',
    example: 'your current password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
