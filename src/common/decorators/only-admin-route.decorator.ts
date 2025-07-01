import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { ONLY_ADMIN_KEY } from './only-admin.decorator';
import { OnlyAdminGuard } from '@common/guards';

export function OnlyAdminRoute() {
  return applyDecorators(
    SetMetadata(ONLY_ADMIN_KEY, true),
    UseGuards(OnlyAdminGuard),
  );
}
