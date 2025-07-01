import { appConfig, dbConfig, jwtConfig } from '@common/config';
import { APP_VALIDATIONS } from '@common/validators/env-validation-schema';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: APP_VALIDATIONS,
      load: [appConfig, dbConfig, jwtConfig],
    }),
    PrismaModule.forRootAsync(),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
