import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TagDTO implements Tag {
  @ApiProperty({ type: Number })
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ type: String, minLength: 2, maxLength: 50 })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;
}
