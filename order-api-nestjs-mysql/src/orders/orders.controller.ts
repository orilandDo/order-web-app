import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ModifyOrderDto } from './dto/modify-order.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
  
    @Get()
    findAll(): Promise<Order[]> {
      return this.ordersService.findAll()
    }
  
    @Get(':id')
    get(@Param('id', ParseIntPipe) id: number): Promise<Order> {
      return this.ordersService.findOne(id);
    }
  
    @Post()
    create(@Body() createOderDto: ModifyOrderDto) {
      return this.ordersService.create(createOderDto);
    }
  
    @Put()
    update(@Body() modifyProductDto: ModifyOrderDto) {
      return this.ordersService.update(modifyProductDto);
    }

    @Put('/status')
    updateStatus(@Body() body) {
      return this.ordersService.updateStatus(body);
    }
  
    @Delete(':id')
    deleteUser(@Param('id') id: number) {
      return this.ordersService.delete(id);
    }

    @Post('/search')
    search(@Body() searchOderDto: SearchOrderDto): Promise<Order[]> {
      return this.ordersService.search(searchOderDto);
    }
}
