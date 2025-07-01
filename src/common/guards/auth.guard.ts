import { TokenPayloadDTO } from '@common/dto';
import { TokenTypes } from '@common/enums';
import { IJwt } from '@common/models';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export const AuthUserGuard = (tokenType: TokenTypes = TokenTypes.ACCESS) => {
  @Injectable()
  class AuthUserGuard implements CanActivate {
    constructor(
      public readonly _jwtService: JwtService,
      public readonly _configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const secretKeys = this._configService.get<IJwt>('JWT_CONFIG')!;

      const tokenSecretKeys = {
        [TokenTypes.ACCESS]: secretKeys.JWT_SECRET!,
        [TokenTypes.REFRESH]: secretKeys.JWT_REFRESH_SECRET,
      };

      const options = {
        secret: tokenSecretKeys[tokenType],
      };

      const accessToken = (
        request.headers?.authorization ?? request.query?.authorization
      )
        ?.replace('Bearer', '')
        ?.trim();

      if (!accessToken) {
        throw new UnauthorizedException('Authorization header is required');
      }

      try {
        await this._jwtService.verify(accessToken, options);
        const payload = this._jwtService.decode(accessToken) as TokenPayloadDTO;

        request.user = payload;
        return true;
      } catch (e) {
        throw new UnauthorizedException('User unauthorized');
      }
    }
  }

  const guard = mixin(AuthUserGuard);
  return guard;
};
