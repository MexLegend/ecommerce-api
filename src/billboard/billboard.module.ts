import { Module } from '@nestjs/common';
import { BillboardService } from './billboard.service';
import { BillboardController } from './billboard.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [BillboardController],
  providers: [BillboardService, CloudinaryService]
})
export class BillboardModule {}
