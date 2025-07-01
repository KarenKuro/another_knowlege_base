import { IsNotEmpty, IsString } from "class-validator";
import { TokenPayloadDTO } from "./token-payload.dto";
import { ApiProperty } from "@nestjs/swagger";

 export class RefreshPayloadDTO extends TokenPayloadDTO {
  @ApiProperty({ type: String})
  @IsString()
  @IsNotEmpty()
  jti: string;
 }