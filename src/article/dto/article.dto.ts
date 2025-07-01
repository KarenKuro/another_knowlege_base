import { ApiProperty } from '@nestjs/swagger';
import { Article } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ArticleDTO implements Article {
  @ApiProperty({ type: Number })
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ type: String, minLength: 2, maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: Boolean, default: false })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'false')
  isPublic: boolean;

  @ApiProperty({ type: Number })
  @IsPositive()
  @IsNotEmpty()
  authorId: number;

  @ApiProperty({ type: Number })
  @IsPositive()
  @IsNotEmpty()
  lastEditorId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
