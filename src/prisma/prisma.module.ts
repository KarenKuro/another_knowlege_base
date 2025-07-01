import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import dbConfig from '@common/config/database.config';
import { PrismaService } from './prisma.service';

@Global()
@Module({})
export class PrismaModule {
  static forRootAsync(): DynamicModule {
    return {
      module: PrismaModule,
      imports: [ConfigModule.forFeature(dbConfig)],
      providers: [
        {
          provide: PrismaService,
          inject: [dbConfig.KEY],
          useFactory: (cfg: ConfigType<typeof dbConfig>) => {
            const url = `postgresql://${cfg.USERNAME}:${cfg.PASSWORD}@${cfg.HOST}:${cfg.PORT}/${cfg.NAME}?schema=public`;
            return new PrismaService({ datasources: { db: { url } } });
          },
        },
      ],
      exports: [PrismaService],
    };
  }
}