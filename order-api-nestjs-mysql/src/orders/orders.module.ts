import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { Order } from './entities/order.entity';
import { ProductOrder } from './entities/product-order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  imports: [TypeOrmModule.forFeature([Order, ProductOrder, Product])],
  providers: [OrdersService, ProductsService],
})
export class OrdersModule {}
