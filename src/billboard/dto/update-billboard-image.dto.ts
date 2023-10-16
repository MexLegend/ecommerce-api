import { PartialType } from '@nestjs/mapped-types';
import { CreateBillboardDto } from './create-billboard.dto';

export class UpdateBillboardImageDto extends PartialType(CreateBillboardDto) {
    oldPublicId: string
}
