import { Image } from "src/types/image";

export class CreateColorDto {
    name: string;
    color: string;
    colorImages: Image[];
    productIds: string[];
    storeId: string;
}
