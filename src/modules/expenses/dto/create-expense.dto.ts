import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsFuture } from '../../../utils/decorators';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'description',
    example: 'description of expense',
  })
  @IsNotEmpty()
  @MaxLength(191, { message: 'Description must be less than 191 characters' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'date',
    example: 'date of expense',
  })
  @IsDate()
  @IsFuture()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'value',
    example: 'value of expense',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    description: 'userId',
    example: 'identify of user associate with expense create',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
