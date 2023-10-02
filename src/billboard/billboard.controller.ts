import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { BillboardService } from './billboard.service';
import { CreateBillboardDto } from './dto/create-billboard.dto';
import { UpdateBillboardDto } from './dto/update-billboard.dto';
import { GetParams } from 'src/types/getParams';

@Controller('billboard')
export class BillboardController {
  constructor(private readonly billboardService: BillboardService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBillboardDto: CreateBillboardDto) {
    return this.billboardService.create(createBillboardDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() params: GetParams) {
    return this.billboardService.findAll(params);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.billboardService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateBillboardDto: UpdateBillboardDto) {
    return this.billboardService.update(id, updateBillboardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.billboardService.remove(id);
  }
}
