import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetParams } from '../types/getParams';

@Injectable()
export class ProductService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async create({ images, ...product }: CreateProductDto) {
    return await this.prismaService.product.create({
      data: {
        ...product,
        images: { create: images }
      }
    });
  }

  async findAll({ storeId, limit, page }: GetParams) {
    return await this.prismaService.product.findMany({
      where: {
        storeId: storeId,
      },
      include: { images: true, category: true, colors: true, sizes: true },
      skip: (+page - 1) * +limit,
      take: +limit
    });
  }

  async findOne(id: string) {
    return await this.prismaService.product.findUnique({
      where: {
        id: id,
      },
      include: { images: true, category: true, colors: true, sizes: true },
    });
  }

  async update(id: string, { images, ...product }: UpdateProductDto) {
    return await this.prismaService.product.update({
      where: {
        id: id,
      },
      data: {
        ...product,
        images: { deleteMany: {}, create: images }
      }
    });
  }

  async remove(id: string) {

    const product = await this.prismaService.product.findUnique({
      where: {
        id: id,
      },
      include: { images: true },
    });

    const productImages = product.images.map((image) => image.publicId);

    this.cloudinaryService.deleteImages(productImages);

    await this.prismaService.product.delete({
      where: {
        id: id,
      },
    });

    return { ok: true };
  }
}
