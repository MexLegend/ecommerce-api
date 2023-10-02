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

  async create({ colorImages, ...color }: CreateColorDto) {
    return await this.prismaService.color.create({
      data: {
        ...color,
        colorImages: { create: colorImages }
        // images: {
        //   createMany: {
        //     data: [...images.map((image: { url: string }) => image)],
        //   },
        // },
        // sizes: {
        //   connect: sizes.map((size: any) => ({
        //     id: size.sizeId,
        //   })),
        // },
      }
    });
  }

  async findAll({ storeId, limit, page }: GetParams) {
    return await this.prismaService.color.findMany({
      where: {
        storeId: storeId,
      },
      include: { colorImages: true},
      skip: (+page - 1) * +limit,
      take: +limit
    });
  }

  async findOne(id: string) {
    return await this.prismaService.color.findUnique({
      where: {
        id: id,
      },
      include: { colorImages: true}
    });
  }

  async update(id: string, { colorImages, ...color }: UpdateColorDto) {
    return await this.prismaService.color.update({
      where: {
        id: id,
      },
      data: {
        ...color,
        colorImages: { deleteMany: {}, create: colorImages }
      }
    });
  }

  async remove(id: string) {

    const color = await this.prismaService.color.findUnique({
      where: {
        id: id,
      },
      include: { colorImages: true },
    });

    const colorImages = color.colorImages.map((image) => image.publicId);

    this.cloudinaryService.deleteImages(colorImages);

    await this.prismaService.color.delete({
      where: {
        id: id,
      },
    });

    return { ok: true };
  }
}
