import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetParams } from '../types/getParams';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetProductDto } from './dto/get-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() params: GetParams) {
    return this.productService.findAll(params);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('in/stock')
  @HttpCode(HttpStatus.OK)
  findInStock(@Query() params: GetParams) {
    return this.productService.findInStock(params);
  }

  @Public()
  @Get('best/selling')
  @HttpCode(HttpStatus.OK)
  findBestSelling(@Query() params: GetParams) {
    return this.productService.findBestSelling(params);
  }

  @Public()
  @Get('filtered/list')
  @HttpCode(HttpStatus.OK)
  finByCategory(@Query() params: GetProductDto) {
    return this.productService.findByFilters(params);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
