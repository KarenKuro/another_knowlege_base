import { PickType } from '@nestjs/swagger';
import { TagDTO } from './tag.dto';

export class CreateTagDto extends PickType(TagDTO, ['name']) {}
