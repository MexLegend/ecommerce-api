import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetParams } from 'src/types/getParams';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(category: CreateCategoryDto) {
    return await this.prismaService.category.create({
      data: category
    });
  }

  async findAll({ storeId, limit, page }: GetParams) {

    const totalCategories = await this.prismaService.category.count();

    const categories = await this.prismaService.category.findMany({
      where: {
        storeId: storeId,
      },
      include: {
        products: true,
        billboard: {
          include: {
            image: true
          }
        }
      },
      skip: (+page - 1) * +limit,
      take: +limit
    });

    return {
      data: categories,
      total: totalCategories
    }
  }

  async findOne(id: string) {
    return await this.prismaService.category.findUnique({
      where: {
        id: id,
      },
      include: { billboard: true },
    });
  }

  async update(id: string, category: UpdateCategoryDto) {
    return await this.prismaService.category.update({
      where: {
        id: id,
      },
      data: category
    });
  }

  async remove(id: string) {

    await this.prismaService.category.delete({
      where: {
        id: id,
      },
    });

    return { ok: true };
  }
}
