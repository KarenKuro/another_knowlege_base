import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { jwtConfig } from '@common/config';

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
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
