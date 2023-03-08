import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { Delivery } from './entities/delivery.entity';

@Module({
  controllers: [DeliveryController],
  imports: [TypeOrmModule.forFeature([Delivery])],
  providers: [DeliveryService]
})
export class DeliveryModule {}
