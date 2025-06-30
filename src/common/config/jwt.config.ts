import { IJwt } from '@common/models';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'JWT_CONFIG',
  (): IJwt => ({
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN!,
  }),
);
