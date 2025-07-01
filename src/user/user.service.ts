import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthTokensDTO, TokenPayloadDTO } from '@common/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _authService: AuthService,
  ) {}

  async update(
    updateDTO: UpdateUserDTO,
    payload: TokenPayloadDTO,
  ): Promise<AuthTokensDTO> {
    const user = await this._prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existUserWithThatEmail = await this._prisma.user.findUnique({
      where: { email: updateDTO.email },
    });

    if (existUserWithThatEmail) {
      throw new ConflictException('User already exist');
    }
    const hashedPassword = await bcrypt.hash(updateDTO.password, 15);

    const updatedUser = await this._prisma.user.update({
      where: { id: payload.id },
      data: {
        name: updateDTO.name,
        email: updateDTO.email,
        password: hashedPassword,
      },
    });

    return this._authService._generateTokens({
      id: updatedUser.id,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  }

  async delete(userId: number): Promise<void> {
    const existingUser = await this._prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this._prisma.user.delete({
      where: { id: userId },
    });
  }

  async makeAdmin(userId: number): Promise<void> {
    const existingUser = await this._prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (existingUser.isAdmin) {
      throw new ForbiddenException('User is already admin');
    }

    await this._prisma.user.update({
      where: { id: userId },
      data: { isAdmin: true },
    });
  }
}
