import { Controller, Get } from '@nestjs/common';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) {}
  
    @Get()
    findAll(): Promise<Menu[]> {
      return this.menuService.findAll()
    }
}
