import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from './entities/delivery.entity';

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(Delivery)
        public readonly deliveryRepo: Repository<Delivery>,
    ) { }

    async findAll(): Promise<Delivery[]> {
        return await this.deliveryRepo.find();
    }
}
