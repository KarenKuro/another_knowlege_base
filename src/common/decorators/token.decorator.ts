import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthToken = createParamDecorator(
  (_: string, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const token: string = request.headers.authorization;
    return token;
  },
);
