import { appConfig, dbConfig, jwtConfig } from '@common/config';
import { APP_VALIDATIONS } from '@common/validators/env-validation-schema';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
      validationSchema: APP_VALIDATIONS,
      load: [appConfig, dbConfig, jwtConfig],
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
