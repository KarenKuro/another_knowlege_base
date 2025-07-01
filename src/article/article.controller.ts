import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthUserGuard } from '@common/guards';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@common/decorators';
import { TokenPayloadDTO } from '@common/dto';
import { ArticleResponseDTO } from './dto/response/article-response.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthUserGuard())
  @Post('create')
  @ApiOperation({
    summary: 'This API aimed to create new article with tags',
  })
  @ApiResponse({
    status: 201,
    description: 'Return article',
    type: ArticleResponseDTO,
  })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @User() payload: TokenPayloadDTO,
  ): Promise<ArticleResponseDTO> {
    return await this.articleService.create(createArticleDto, payload.id);
  }

  @UseGuards(AuthUserGuard())
  @Patch(':id')
  @ApiOperation({
    summary: 'This API aimed to update article with tags',
  })
  @ApiResponse({
    status: 200,
    description: 'Return article',
    type: ArticleResponseDTO,
  })
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @User() payload: TokenPayloadDTO,
  ): Promise<ArticleResponseDTO> {
    return await this.articleService.update(+id, updateArticleDto, payload.id);
  }

  @UseGuards(AuthUserGuard())
  @Delete(':id')
  @ApiOperation({
    summary: 'This API aimed to remove article',
  })
  @ApiResponse({
    status: 204,
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.articleService.remove(+id);
  }

  @UseGuards(AuthUserGuard())
  @ApiOperation({ summary: 'Find all articles' })
  @ApiResponse({
    status: 200,
    description: 'Return articles',
    type: [ArticleResponseDTO],
  })
  @Get()
  async findAll(): Promise<ArticleResponseDTO[]> {
    return await this.articleService.findAll();
  }

  @UseGuards(AuthUserGuard())
  @ApiOperation({ summary: 'Find article by id' })
  @ApiResponse({
    status: 200,
    description: 'Return article',
    type: ArticleResponseDTO,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ArticleResponseDTO> {
    return await this.articleService.findOne(+id);
  }

  @UseGuards(AuthUserGuard())
  @Get('by-tag')
  @ApiOperation({ summary: 'Find articles by tag name' })
  @ApiResponse({
    status: 200,
    description: 'Return articles',
    type: [ArticleResponseDTO],
  })
  async findByTag(@Query('name') tagName: string) {
    return await this.articleService.findByTag(tagName);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all public articles (guest access)' })
  @ApiResponse({
    status: 200,
    description: 'Return articles',
    type: [ArticleResponseDTO],
  })
  findAllForGuest(): Promise<ArticleResponseDTO[]> {
    return this.articleService.findAllForGuest();
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'Get one public article by id (guest access)' })
  @ApiResponse({
    status: 200,
    description: 'Return article',
    type: ArticleResponseDTO,
  })
  async findOneForGuest(@Param('id') id: string): Promise<ArticleResponseDTO> {
    return await this.articleService.findOneForGuest(+id);
  }

  @Get('public/by-tag/:tagName')
  @ApiOperation({ summary: 'Get public articles by tag name (guest access)' })
  @ApiResponse({
    status: 200,
    description: 'Return articles',
    type: [ArticleResponseDTO],
  })
  async findPublicByTag(
    @Param('tagName') tagName: string,
  ): Promise<ArticleResponseDTO[]> {
    return await this.articleService.findPublicByTag(tagName);
  }
}
