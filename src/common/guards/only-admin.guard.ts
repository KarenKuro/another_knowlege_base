import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OnlyAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isOnlyAdmin = this.reflector.get<boolean>(
      'onlyAdmin',
      context.getHandler(),
    );

    if (!isOnlyAdmin) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.isAdmin) {
      throw new ForbiddenException('Access restricted to admins only');
    }

    return true;
  }
}
