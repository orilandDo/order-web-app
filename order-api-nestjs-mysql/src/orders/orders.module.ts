import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductOrder } from './entities/product-order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  imports: [TypeOrmModule.forFeature([Order, ProductOrder])],
  providers: [OrdersService],
})
export class OrdersModule {}
