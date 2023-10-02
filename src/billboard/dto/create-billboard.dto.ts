import { Image } from "src/types/image";

export class CreateBillboardDto {
    label: string;
    description: string;
    image: Image;
    storeId: string;
}
