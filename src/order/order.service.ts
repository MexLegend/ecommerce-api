import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetParams } from 'src/types/getParams';
import { GraphDataDto } from './dto/graph-data.dto';
import Stripe from 'stripe';
import { stripe } from 'src/helpers/stripe';

interface ProductData {
  name: string;
  description?: string;
  images?: string[]; // A list of up to 8 URLs of images for this product
}

interface PriceData {
  currency: string;
  product_data: ProductData;
  unit_amount: number;
}

interface LineItem {
  quantity: number;
  price_data: PriceData;
}

@Injectable()
export class OrderService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(orderData: CreateOrderDto) {

    const productIds = orderData.orderItems.map(orderItem => orderItem.productId);

    const products = await this.prismaService.product.findMany({
      where: {
        id: { in: productIds }
      },
      include: {
        images: true
      }
    });

    const lineItems: LineItem[] = orderData.orderItems.map(orderItem => {
      const currentProduct = products.find(product => product.id === orderItem.productId);

      return {
        quantity: orderItem.quantity,
        price_data: {
          currency: "USD",
          unit_amount: currentProduct.price * 100,
          product_data: {
            name: currentProduct.name,
            description: currentProduct.description,
            images: currentProduct.images.filter(image => image.colorId === orderItem.colorId).map(image => image.url)
          }
        }
      }
    });

    const order = await this.prismaService.order.create({
      data: {
        storeId: orderData.storeId,
        userId: orderData.userId,
        isPaid: false,
        orderItems: {
          create: orderData.orderItems.map(orderItem => ({
            colorId: orderItem.colorId,
            sizeId: orderItem.sizeId,
            product: {
              connect: {
                id: orderItem.productId
              }
            },
            quantity: orderItem.quantity
          }))
        }
      }
    });

    const sesion = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      success_url: `${process.env.FRONTEND_URL}/order/${order.id}#success`,
      cancel_url: `${process.env.FRONTEND_URL}/order/${order.id}#error`,
      metadata: {
        orderId: order.id
      }
    });

    return { url: sesion.url, orderId: order.id }
  }

  async findAll({ storeId, limit, page }: GetParams) {

    const totalOrders = await this.prismaService.order.count({
      where: {
        storeId: storeId,
      },
    });

    const orders = await this.prismaService.order.findMany({
      where: {
        storeId: storeId,
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        }
      },
      skip: (+page - 1) * +limit,
      take: +limit
    });

    return {
      data: orders,
      total: totalOrders
    }
  }

  async findOne(id: string) {
    return await this.prismaService.order.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
  }

  async findSalesCount(storeId: string) {

    return await this.prismaService.order.count({
      where: {
        storeId: storeId,
        isPaid: true
      },
    });
  }

  async findTotalRevenue(storeId: string) {

    const paidOrders = await this.prismaService.order.findMany({
      where: {
        storeId,
        isPaid: true,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    const totalRevenue = paidOrders.reduce((total, order) => {
      const orderTotal = order.orderItems.reduce((orderSum, item) => {
        return orderSum + item.product.price;
      }, 0);
      return total + orderTotal;
    }, 0);

    return totalRevenue;
  }

  async findGraphRevenue(storeId: string) {

    const paidOrders = await this.prismaService.order.findMany({
      where: {
        storeId,
        isPaid: true
      },
      include: {
        orderItems: {
          include: {
            product: true
          },
        },
      },
    });

    const monthlyRevenue: { [key: number]: number } = {};

    // Grouping the orders by month and summing the revenue
    for (const order of paidOrders) {
      const month = order.createdAt.getMonth(); // 0 for Jan, 1 for Feb, ...
      let revenueForOrder = 0;

      for (const item of order.orderItems) {
        revenueForOrder += item.product.price;
      }

      // Adding the revenue for this order to the respective month
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }

    // Converting the grouped data into the format expected by the graph
    const graphData: GraphDataDto[] = [
      { name: "Jan", value: 0 },
      { name: "Feb", value: 0 },
      { name: "Mar", value: 0 },
      { name: "Apr", value: 0 },
      { name: "May", value: 0 },
      { name: "Jun", value: 0 },
      { name: "Jul", value: 0 },
      { name: "Aug", value: 0 },
      { name: "Sep", value: 0 },
      { name: "Oct", value: 0 },
      { name: "Nov", value: 0 },
      { name: "Dec", value: 0 },
    ];

    // Filling in the revenue data
    for (const month in monthlyRevenue) {
      graphData[parseInt(month)].value = monthlyRevenue[parseInt(month)];
    }

    return graphData;
  }

  async remove(id: string) {

    await this.prismaService.size.delete({
      where: {
        id: id,
      },
    });

    return { ok: true };
  }
}
