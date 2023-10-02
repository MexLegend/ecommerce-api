import { Image } from "src/types/image";

export class CreateProductDto {
    categoryId: string;
    colorIds: string[];
    description: string;
    images?: Image[];
    name: string
    price: number;
    sizeIds: string[];
    stock: number;
    storeId: string;
}
