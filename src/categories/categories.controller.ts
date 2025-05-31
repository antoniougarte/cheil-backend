import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { sendResponse, getErrorMessage } from 'src/common/utils/response.util';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto, @Res() res: Response) {
    try {
      const category = await this.categoriesService.create(dto);
      return sendResponse(
        res,
        HttpStatus.CREATED,
        'Category created',
        category,
      );
    } catch (error) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        'Error creating category',
        null,
        [getErrorMessage(error)],
      );
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const categories = await this.categoriesService.findAll();
      return sendResponse(res, HttpStatus.OK, 'Categories found', categories);
    } catch (error) {
      return sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching categories',
        null,
        [getErrorMessage(error)],
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const category = await this.categoriesService.findOne(id);
      return sendResponse(res, HttpStatus.OK, 'Category found', category);
    } catch (error) {
      return sendResponse(
        res,
        HttpStatus.NOT_FOUND,
        'Category not found',
        null,
        [getErrorMessage(error)],
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const updated = await this.categoriesService.update(id, dto);
      return sendResponse(res, HttpStatus.OK, 'Category updated', updated);
    } catch (error) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        'Error updating category',
        null,
        [getErrorMessage(error)],
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      await this.categoriesService.remove(id);
      return sendResponse(res, HttpStatus.OK, 'Category deleted', null);
    } catch (error) {
      console.error('Error deleting category:', error);
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        'Error deleting category',
        null,
        [getErrorMessage(error)],
      );
    }
  }
}
