export type OrderItem = {
    productId: string;
    colorId: string;
    sizeId: string;
    quantity: number;
}

export class CreateOrderDto {
    address?: string;
    orderItems: OrderItem[];
    phone?: string;
    storeId: string;
    userId: string;
}
