import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { OnlyAdminRoute, User } from '@common/decorators';
import { AuthTokensDTO, TokenPayloadDTO } from '@common/dto';
import { AuthUserGuard } from '@common/guards';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthUserGuard())
@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Put('')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'Return "access and refresh tokens"',
    type: AuthTokensDTO,
  })
  async updateUser(
    @Body() updateDTO: UpdateUserDTO,
    @User() payload: TokenPayloadDTO,
  ): Promise<AuthTokensDTO> {
    return this._userService.update(updateDTO, payload);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove user' })
  @ApiResponse({
    status: 204,
    description: 'Remove user"',
  })
  async deleteUser(@User() payload: TokenPayloadDTO): Promise<void> {
    await this._userService.delete(payload.id);
  }

  @OnlyAdminRoute()
  @Patch(':id/make-admin')
  @ApiOperation({ summary: 'Only admin can make new admin.' })
  @ApiResponse({
    status: 204,
    description: 'Make new admin',
  })
  async makeAdmin(@Param('id') userId: number) {
    return this._userService.makeAdmin(userId);
  }
}
