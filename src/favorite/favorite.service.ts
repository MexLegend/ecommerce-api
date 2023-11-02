import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { GetFavoritesDto } from './dto/get-favorites.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async toogleFavorite({ productIds, userId }: CreateFavoriteDto) {
    return await this.prismaService.favoriteProducts.upsert({
      where: {
        userId
      },
      create: { productIds, userId },
      update: { productIds }
    });
  }

  async findAll({ userId, limit, page }: GetFavoritesDto) {

    const totalFavorites = await this.prismaService.favoriteProducts.count({
      where: {
        userId
      }
    });

    const favorites = await this.prismaService.favoriteProducts.findFirst({
      where: {
        userId
      },
      include: {
        products: {
          include: {
            images: true,
            category: true,
            colors: true,
            sizes: true
          }
        }
      },
      skip: (+page - 1) * +limit,
      take: +limit
    });

    return {
      data: favorites,
      total: totalFavorites
    }
  }

}
