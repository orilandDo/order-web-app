import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductEntity } from '../entities/product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Get()
    findAll(): Promise<ProductEntity[]> {
      return this.productService.findAll()
    }
  
    @Get(':id')
    get(@Param() params) {
      return this.productService.findOne(params.id);
    }
  
    @Post()
    create(@Body() entity: ProductEntity) {
      return this.productService.create(entity);
    }
  
    @Put()
    update(@Body() entity: ProductEntity) {
      return this.productService.update(entity);
    }
  
    @Delete(':id')
    deleteUser(@Param() params) {
      return this.productService.delete(params.id);
    }
}
