import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensDTO {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
