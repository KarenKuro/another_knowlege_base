import { ApiProperty, PickType } from '@nestjs/swagger';
import { ArticleDTO } from '../article.dto';
import { TagResponseDto } from './tag-response.dto';

export class ArticleResponseDTO extends PickType(ArticleDTO, [
  'id',
  'title',
  'content',
  'isPublic',
  'updatedAt',
]) {

  @ApiProperty({ example: 1 })
  authorId: number;

  @ApiProperty({ example: 2 })
  lastEditorId: number;

  tags: TagResponseDto[];
}
