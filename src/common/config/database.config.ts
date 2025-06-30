import { IDatabaseConfig } from '@common/models';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'DB_CONFIG',
  (): IDatabaseConfig => ({
    HOST: process.env.DATABASE_HOST!,
    PORT: +process.env.DATABASE_PORT!,
    NAME: process.env.DATABASE_NAME!,
    USERNAME: process.env.DATABASE_USER!,
    PASSWORD: process.env.DATABASE_PASSWORD!,
  }),
);
