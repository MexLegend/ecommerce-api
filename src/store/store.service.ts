import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetParams } from 'src/types/getParams';

@Injectable()
export class StoreService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(store: CreateStoreDto) {
    return await this.prismaService.store.create({
      data: store
    });
  }

  async findAll({ limit, page }: GetParams) {

    const totalStores = await this.prismaService.store.count();

    const stores = await this.prismaService.store.findMany({
      include: {
        billboards: {
          include: { image: true }
        },
        products: {
          include: {
            images: true
          }
        }
      },
      skip: (+page - 1) * +limit,
      take: +limit
    });

    return {
      data: stores,
      total: totalStores
    }
  }

  async findByUser(userId: string) {

    const totalStores = await this.prismaService.store.count(
      {
        where: {
          userId: userId
        }
      }
    );

    const stores = await this.prismaService.store.findMany({
      where: {
        userId: userId
      }
    });

    return {
      data: stores,
      total: totalStores
    }
  }

  async findOne(id: string) {
    return await this.prismaService.store.findUnique({
      where: {
        id: id,
      }
    });
  }

  async findBySlug(slug: string) {
    return await this.prismaService.store.findUnique({
      where: {
        slug: slug,
      },
      include: {
        billboards: {
          include: { image: true }
        },
        categories: true,
        products: {
          include: {
            images: true,
            category: true,
            colors: true,
            sizes: true
          },
        }
      }
    });
  }

  async update(id: string, store: UpdateStoreDto) {
    return await this.prismaService.store.update({
      where: {
        id: id,
      },
      data: store
    });
  }

  async remove(id: string) {

    await this.prismaService.store.delete({
      where: {
        id: id,
      },
    });

    return { ok: true };
  }
}
