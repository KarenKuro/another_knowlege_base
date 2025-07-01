import { PickType } from '@nestjs/swagger';
import { TagDTO } from '../tag.dto';

export class TagResponseDto extends PickType(TagDTO, ['name']) {}
