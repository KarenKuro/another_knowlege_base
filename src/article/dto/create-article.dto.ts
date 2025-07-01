import { ApiProperty, PickType } from '@nestjs/swagger';
import { ArticleDTO } from './article.dto';
import { CreateTagDto } from './create-tag.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArticleDto extends PickType(ArticleDTO, [
  'title',
  'content',
  'isPublic',
]) {
  @ApiProperty({ type: [String], minItems: 1, maxItems: 3 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  tags: CreateTagDto[];
}
