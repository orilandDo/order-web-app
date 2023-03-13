import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductOrder } from '../orders/entities/product-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductOrder])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
