import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { sendResponse, getErrorMessage } from 'src/common/utils/response.util';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() dto: CreateProductDto, @Res() res: Response) {
    try {
      const product = await this.productsService.create(dto);
      return sendResponse(res, HttpStatus.CREATED, 'Product created', product);
    } catch (error) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        'Error creating product',
        null,
        [getErrorMessage(error)],
      );
    }
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Res() res: Response,
  ) {
    try {
      const products = await this.productsService.findAll(
        parseInt(page, 10),
        parseInt(limit, 10),
      );
      return sendResponse(res, HttpStatus.OK, 'Products found', products);
    } catch (error) {
      return sendResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching products',
        null,
        [getErrorMessage(error)],
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const product = await this.productsService.findOne(id);
      return sendResponse(res, HttpStatus.OK, 'Product found', product);
    } catch (error) {
      return sendResponse(
        res,
        HttpStatus.NOT_FOUND,
        'Product not found',
        null,
        [getErrorMessage(error)],
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @Res() res: Response,
  ) {
    try {
      const updated = await this.productsService.update(id, dto);
      return sendResponse(res, HttpStatus.OK, 'Product updated', updated);
    } catch (error) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        'Error updating product',
        null,
        [getErrorMessage(error)],
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      await this.productsService.remove(id);
      return sendResponse(res, HttpStatus.OK, 'Product deleted');
    } catch (error) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        'Error deleting product',
        null,
        [getErrorMessage(error)],
      );
    }
  }
}
