import { OrderItem } from "src/types/orderItem";

export class CreateOrderDto {
    address: string;
    isPaid: boolean;
    // orderItems: OrderItem[];
    phone: string;
    storeId: string;
}
