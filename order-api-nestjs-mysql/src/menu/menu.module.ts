import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
    controllers: [MenuController],
    imports: [TypeOrmModule.forFeature([Menu])],
    providers: [MenuService],
})
export class MenuModule {}
