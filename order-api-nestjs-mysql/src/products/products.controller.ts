import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductDto } from './dto/modify-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) { }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll()
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body() createProductDto: ProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put()
  update(@Body() modifyProductDto: ProductDto) {
    return this.productService.update(modifyProductDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
