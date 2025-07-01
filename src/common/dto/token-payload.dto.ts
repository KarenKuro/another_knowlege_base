import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsPositive } from 'class-validator';

export class TokenPayloadDTO {
  @ApiProperty({ type: Number })
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsNotEmpty()
  isAdmin: boolean;

  @ApiProperty({ type: String, format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
