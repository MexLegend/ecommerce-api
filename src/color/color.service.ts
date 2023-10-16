import { Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetParams } from 'src/types/getParams';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ColorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  async create(color: CreateColorDto) {

    return await this.prismaService.color.create({
      data: color
    });
  }

  async findAll({ storeId, limit, page }: GetParams) {

    const totalColors = await this.prismaService.color.count();

    const colors = await this.prismaService.color.findMany({
      where: {
        storeId: storeId,
      },
      include: { products: true },
      skip: (+page - 1) * +limit,
      take: +limit
    });

    return {
      data: colors,
      total: totalColors
    }
  }

  async findOne(id: string) {
    return await this.prismaService.color.findUnique({
      where: {
        id: id,
      }
    });
  }

  async update(id: string, color: UpdateColorDto) {
    return await this.prismaService.color.update({
      where: {
        id: id,
      },
      data: color
    });
  }

  async remove(id: string) {

    await this.prismaService.color.delete({
      where: {
        id: id,
      },
    });

    return { ok: true };
  }
}
