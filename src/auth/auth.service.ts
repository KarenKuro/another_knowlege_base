import { jwtConfig } from '@common/config';
import { AuthTokensDTO, TokenPayloadDTO } from '@common/dto';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  constructor(
    private readonly _jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly cfg: ConfigType<typeof jwtConfig>,

    private readonly _prismaService: PrismaService,
  ) {}

  async onApplicationBootstrap() {
    const defoult_Admin = {
      name: 'admin',
      email: 'admin@admin.ru',
      password: '12345',
    };

    await this._upsert(defoult_Admin, true);
  }

  async register({
    name,
    email,
    password,
  }: CreateUserDTO): Promise<AuthTokensDTO> {
    const existUser = await this._prismaService.user.findUnique({
      where: { email },
    });

    if (existUser) {
      throw new ConflictException('User already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    const user: User = await this._prismaService.user.create({
      data: { name, email, password: hashedPassword, isAdmin: false },
    });

    return this._generateTokens({ id: user.id, email, isAdmin: false });
  }

  async login(body: LoginDTO): Promise<AuthTokensDTO> {
    const { email, password } = body;

    const user = await this._prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User with that email not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this._generateTokens({ id: user.id, email, isAdmin: user.isAdmin });
  }

  _generateTokens(data: TokenPayloadDTO): AuthTokensDTO {
    const accessToken = this.createAccessToken(data);
    const refreshToken = this.createRefreshToken(data);

    return { accessToken, refreshToken };
  }

  createAccessToken(payload: TokenPayloadDTO): string {
    return this._jwtService.sign(payload);
  }

  createRefreshToken(payload: TokenPayloadDTO): string {
    const refreshToken = randomUUID();

    return this._jwtService.sign(
      {
        id: payload.id,
        email: payload.email,
        isAdmin: payload.isAdmin,
        jti: refreshToken,
      },
      {
        secret: this.cfg.JWT_REFRESH_SECRET,
        expiresIn: this.cfg.JWT_REFRESH_EXPIRES_IN,
      },
    );
  }

  async refreshAccessToken(
    id: number,
    refreshToken: string,
  ): Promise<AuthTokensDTO> {
    refreshToken = refreshToken?.replace('Bearer', '')?.trim();

    const existingUser = await this._prismaService.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const data = {
      id: existingUser.id,
      isAdmin: existingUser.isAdmin,
      email: existingUser.email,
    };

    const accessToken = this.createAccessToken(data);
    const newRefreshToken = this.createRefreshToken(data);

    return { accessToken, refreshToken: newRefreshToken };
  }

  private async _upsert(user: CreateUserDTO, isAdmin) {
    const hashedPassword = await bcrypt.hash(user.password, 15);

    await this._prismaService.user.upsert({
      where: { email: user.email },
      update: { name: user.name, password: hashedPassword, isAdmin },
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        isAdmin,
      },
    });
  }
}
