import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthTokensDTO, TokenPayloadDTO } from '@common/dto';
import { TokenTypes } from '@common/enums';
import { AuthToken, User } from '@common/decorators';
import { AuthUserGuard } from '@common/guards';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';

@ApiTags('Authentication management')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'This API aimed to register new user',
  })
  @ApiResponse({
    status: 201,
    description: 'Return "access and refresh tokens"',
    type: AuthTokensDTO,
  })
  async register(@Body() dto: CreateUserDTO): Promise<AuthTokensDTO> {
    return this._authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'This API aimed to login user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Return "access and refresh tokens"',
    type: AuthTokensDTO,
  })
  async login(@Body() dto: LoginDTO): Promise<AuthTokensDTO> {
    return this._authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({
    summary:
      'This API aimed to check the "refresh token" and refresh the access and refresh tokens.',
  })
  @ApiResponse({
    status: 201,
    description: 'Return "access and refresh tokens"',
    type: AuthTokensDTO,
  })
  @UseGuards(AuthUserGuard(TokenTypes.REFRESH))
  async refreshTokens(
    @AuthToken() refreshToken: string,
    @User() user: TokenPayloadDTO,
  ): Promise<AuthTokensDTO> {
    return this._authService.refreshAccessToken(user.id, refreshToken);
  }

  @Get('me')
  @UseGuards(AuthUserGuard())
  @ApiResponse({
    status: 200,
    description: 'Return current user"',
    type: AuthTokensDTO,
  })
  @UseGuards(AuthUserGuard(TokenTypes.ACCESS))
  async me(@User() user: TokenPayloadDTO): Promise<TokenPayloadDTO> {
    return user;
  }
}
