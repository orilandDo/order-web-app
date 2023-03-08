import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        public readonly menuRepo: Repository<Menu>,
    ) { }

    async findAll(): Promise<Menu[]> {
        return await this.menuRepo.find();
    }

}
