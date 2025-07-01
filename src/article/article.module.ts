import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { jwtConfig } from '@common/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
     ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync({
          inject: [jwtConfig.KEY],
          useFactory: (cfg: ConfigType<typeof jwtConfig>) => ({
            secret: cfg.JWT_SECRET,
            signOptions: {
              expiresIn: cfg.JWT_EXPIRES_IN,
            },
          }),
        }),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
