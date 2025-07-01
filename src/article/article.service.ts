import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleResponseDTO } from './dto/response/article-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ArticleService {
  constructor(private readonly _prismaService: PrismaService) {}

  async create(
    data: CreateArticleDto,
    userId: number,
  ): Promise<ArticleResponseDTO> {
    const { title, content, isPublic = false, tags } = data;

    const article = await this._prismaService.article.create({
      data: {
        title,
        content,
        isPublic,
        author: { connect: { id: userId } },
        lastEditor: { connect: { id: userId } },
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag.name },
            create: { name: tag.name },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    return article;
  }

  async update(
    id: number,
    data: UpdateArticleDto,
    userId: number,
  ): Promise<ArticleResponseDTO> {
    const article = await this._prismaService.article.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    const dataToUpdate: any = {};

    if (data.title !== undefined) dataToUpdate.title = data.title;
    if (data.content !== undefined) dataToUpdate.content = data.content;
    if (data.isPublic !== undefined) dataToUpdate.isPublic = data.isPublic;

    if (data.tags) {
      const tagConnect = data.tags.map((tag) => ({
        where: { name: tag.name },
        create: { name: tag.name },
      }));

      const updated = await this._prismaService.article.update({
        where: { id },
        data: {
          ...dataToUpdate,
          tags: {
            set: [],
            connectOrCreate: tagConnect,
          },
          lastEditor: {
            connect: { id: userId },
          },
        },
        include: {
          tags: true,
        },
      });

      return updated;
    }

    const updated = await this._prismaService.article.update({
      where: { id },
      data: {
        ...dataToUpdate,
        lastEditor: {
          connect: { id: userId },
        },
      },
      include: {
        tags: true,
      },
    });
    return updated;
  }

  async remove(id: number): Promise<void> {
    const article = await this._prismaService.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    await this._prismaService.article.delete({
      where: { id },
    });
  }

  async findOne(id: number): Promise<ArticleResponseDTO> {
    const article = await this._prismaService.article.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    return article;
  }

  async findAll(): Promise<ArticleResponseDTO[]> {
    const articles = await this._prismaService.article.findMany({
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return articles;
  }

  async findByTag(tagName: string): Promise<ArticleResponseDTO[]> {
    const articles = await this._prismaService.article.findMany({
      where: {
        tags: {
          some: {
            name: tagName,
          },
        },
      },
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return articles;
  }

  async findOneForGuest(id: number): Promise<ArticleResponseDTO> {
    const article = await this._prismaService.article.findFirst({
      where: { id, isPublic: true },
      include: {
        tags: true,
      },
    });

    if (!article) {
      throw new NotFoundException(`Public article with id ${id} not found`);
    }

    return article;
  }

  async findAllForGuest(): Promise<ArticleResponseDTO[]> {
    const articles = await this._prismaService.article.findMany({
      where: { isPublic: true },
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return articles;
  }

  async findPublicByTag(tagName: string): Promise<ArticleResponseDTO[]> {
    const articles = await this._prismaService.article.findMany({
      where: {
        isPublic: true,
        tags: {
          some: {
            name: tagName,
          },
        },
      },
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return articles;
  }
}
