import { Controller, Get } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { Delivery } from './entities/delivery.entity';

@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}
  
    @Get()
    findAll(): Promise<Delivery[]> {
      return this.deliveryService.findAll()
    }
}
