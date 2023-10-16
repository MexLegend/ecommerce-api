import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findAll(userId: string) {

    const totalStores = await this.prismaService.store.count();

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
