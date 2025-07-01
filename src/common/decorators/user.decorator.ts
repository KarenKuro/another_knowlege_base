import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { TokenPayloadDTO } from '@common/dto';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): TokenPayloadDTO => {
    const request = ctx.switchToHttp().getRequest();
    const user: TokenPayloadDTO = request.user;
    return data ? user[data] : user;
  },
);
