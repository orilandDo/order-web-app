import { Body, Controller, Get } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuRo } from './ro/menu.ro';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) {}
  
    @Get()
    findAll(@Body() isAdmin: boolean): Promise<MenuRo[]> {
      return this.menuService.findAll(isAdmin)
    }
}
