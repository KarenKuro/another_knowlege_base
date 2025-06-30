import { registerAs } from '@nestjs/config';

import { IApp } from '@common/models';

export default registerAs(
  'APP_CONFIG',
  (): IApp => ({
    APP_NAME: process.env.APP_NAME!,
    APP_PORT: +process.env.APP_PORT!,
    NODE_ENV: process.env.NODE_ENV!,
  }),
);
