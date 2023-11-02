import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetParams } from 'src/types/getParams';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() params: GetParams) {
    return this.orderService.findAll(params);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('sales-count/:id')
  @HttpCode(HttpStatus.OK)
  findSalesCount(@Param('id') id: string) {
    return this.orderService.findSalesCount(id);
  }

  @Get('total/revenue/:id')
  @HttpCode(HttpStatus.OK)
  findTotalRevenue(@Param('id') id: string) {
    return this.orderService.findTotalRevenue(id);
  }

  @Get('graph/revenue/:id')
  @HttpCode(HttpStatus.OK)
  findGraphRevenue(@Param('id') id: string) {
    return this.orderService.findGraphRevenue(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
