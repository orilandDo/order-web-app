import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { AgencyController } from './agency/agency.controller';
import { AgencyModule } from './agency/agency.module';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import { DeliveryController } from './delivery/delivery.controller';
import { DeliveryModule } from './delivery/delivery.module';
import { MenuController } from './menu/menu.controller';
import { MenuService } from './menu/menu.service';
import { MenuModule } from './menu/menu.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'order_web_app',
      //entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    AuthModule,
    AgencyModule,
    OrdersModule,
    DeliveryModule,
    MenuModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
