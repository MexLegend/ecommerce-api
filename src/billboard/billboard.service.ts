import { Injectable } from '@nestjs/common';
import { CreateBillboardDto } from './dto/create-billboard.dto';
import { UpdateBillboardDto } from './dto/update-billboard.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetParams } from 'src/types/getParams';

@Injectable()
export class BillboardService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async create({ image, ...billboard }: CreateBillboardDto) {
    return await this.prismaService.billboard.create({
      data: {
        ...billboard,
        image: { create: image }
      }
    });
  }

  async findAll({ storeId, limit, page }: GetParams) {
    return await this.prismaService.billboard.findMany({
      where: {
        storeId: storeId,
      },
      include: { image: true, categories: true },
      skip: (+page - 1) * +limit,
      take: +limit
    });
  }

  async findOne(id: string) {
    return await this.prismaService.billboard.findUnique({
      where: {
        id: id,
      },
      include: { image: true, categories: true },
    });
  }

  async update(id: string, { image, ...billboard }: UpdateBillboardDto) {
    return await this.prismaService.billboard.update({
      where: {
        id: id,
      },
      data: {
        ...billboard,
        image: { update: image }
      }
    });
  }

  async remove(id: string) {

    const billboard = await this.prismaService.billboard.findUnique({
      where: {
        id: id,
      },
      include: { image: true },
    });

    const billboardImage = billboard.image.publicId;

    this.cloudinaryService.deleteImages([billboardImage]);

    await this.prismaService.billboard.delete({
      where: {
        id: id,
      },
    });

    return { ok: true };
  }
}
