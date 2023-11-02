import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { BillboardModule } from './billboard/billboard.module';
import { CategoryModule } from './category/category.module';
import { SizeModule } from './size/size.module';
import { ColorModule } from './color/color.module';
import { OrderModule } from './order/order.module';
import { StoreModule } from './store/store.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      ttl: 10,
      max: 100000,
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    CloudinaryModule,
    UserModule,
    ProductModule,
    BillboardModule,
    CategoryModule,
    SizeModule,
    ColorModule,
    OrderModule,
    StoreModule,
    FavoriteModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule { }
