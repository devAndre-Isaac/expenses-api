import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'email',
    example: 'mail@mail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'name',
    example: 'Your Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'password',
    example: 'Your Password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'cpf',
    example: '92318029091',
  })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({
    description: 'telephoneNumber',
    example: '31999999999',
  })
  @IsString()
  @IsNotEmpty()
  telephoneNumber: string;
}
