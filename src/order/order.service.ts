import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetParams } from 'src/types/getParams';

@Injectable()
export class OrderService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(order: CreateOrderDto) {
    return await this.prismaService.order.create({
      data: order
    });
  }

  async findAll({ storeId, limit, page }: GetParams) {

    const totalOrders = await this.prismaService.order.count();

    const orders = await this.prismaService.order.findMany({
      where: {
        storeId: storeId,
      },
      skip: (+page - 1) * +limit,
      take: +limit
    });

    return {
      data: orders,
      total: totalOrders
    }
  }

  async findOne(id: string) {
    return await this.prismaService.order.findUnique({
      where: {
        id: id,
      }
    });
  }

  async update(id: string, order: UpdateOrderDto) {
    return await this.prismaService.order.update({
      where: {
        id: id,
      },
      data: order
    });
  }

  async remove(id: string) {

    await this.prismaService.size.delete({
      where: {
        id: id,
      },
    });

    return { ok: true };
  }
}
