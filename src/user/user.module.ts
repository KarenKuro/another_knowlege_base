import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { jwtConfig } from '@common/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (cfg: ConfigType<typeof jwtConfig>) => ({
        secret: cfg.JWT_SECRET,
        signOptions: {
          expiresIn: cfg.JWT_EXPIRES_IN,
        },
      }),
    }),
    AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
