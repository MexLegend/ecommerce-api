import { Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { GetParams } from 'src/types/getParams';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SizeService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(size: CreateSizeDto) {
    return await this.prismaService.size.create({
      data: size
    });
  }

  async findAll({ storeId, limit, page }: GetParams) {

    const totalSizes = await this.prismaService.size.count({
      where: {
        storeId: storeId,
      },
    });

    const sizes = await this.prismaService.size.findMany({
      where: {
        storeId: storeId,
      },
      include: { products: true },
      skip: (+page - 1) * +limit,
      take: +limit
    });

    return {
      data: sizes,
      total: totalSizes
    }
  }

  async findOne(id: string) {
    return await this.prismaService.size.findUnique({
      where: {
        id: id,
      }
    });
  }

  async update(id: string, size: UpdateSizeDto) {
    return await this.prismaService.size.update({
      where: {
        id: id,
      },
      data: size
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
