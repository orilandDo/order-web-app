import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { MenuService } from '../menu/menu.service';
import { AgencyService } from '../agency/agency.service';
import { Users } from '../user/entities/user.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Agency } from '../agency/entities/agency.entity';
import { DeliveryService } from '../delivery/delivery.service';
import { Delivery } from '../delivery/entities/delivery.entity';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Menu, Agency, Delivery, Product])],
  providers: [AuthService, UserService, MenuService, AgencyService, DeliveryService, ProductsService],
  controllers: [AuthController],
})
export class AuthModule {}
