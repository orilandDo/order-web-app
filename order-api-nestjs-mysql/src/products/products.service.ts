import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from "moment";
import { ProductOrder } from '../orders/entities/product-order.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProductDto } from './dto/modify-product.dto';
import { Product } from './entities/product.entity';
import { ProductRo } from './ro/product.ro';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    public readonly productRepo: Repository<Product>,
    @InjectRepository(ProductOrder)
    public readonly productOrderRepo: Repository<ProductOrder>,
  ) { }

  async findAll(): Promise<Product[]> {
    return await this.productRepo.find({
      select: {
        id: true,
        name: true,
        price: true,
        quantity: true,
        note: true,
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepo.findOne({
      select: {
        id: true,
        name: true,
        price: true,
        quantity: true,
        note: true,
      },
      where: {
        id
      },
    })
  }

  async create(createProductDto: ProductDto): Promise<Product> {
    const product = this.mappingProduct(createProductDto);
    return await this.productRepo.save(product)
  }

  async update(modifyProductDto: ProductDto): Promise<UpdateResult> {
    const product = this.mappingProduct(modifyProductDto);
    return await this.productRepo.update(modifyProductDto.id, product);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.productRepo.delete(id);
  }

  private mappingProduct(modifyProductDto: ProductDto): Product {
    const product = new Product();
    product.name = modifyProductDto.name;
    product.quantity = modifyProductDto.quantity;
    product.price = modifyProductDto.price;
    product.note = modifyProductDto.note;
    if (modifyProductDto.id && modifyProductDto.id !== 0) {
      product.updatedDate = moment().format('DD/MM/YYYY');
    } else {
      product.createdDate = moment().format('DD/MM/YYYY');
    }
    console.log(product)
    return product;
  }

  async sum(userId: number): Promise<ProductRo[]> {
    let res: ProductRo[] = [];
    let sql = this.productOrderRepo
      .createQueryBuilder('po')
      .select('SUM(po.quantity)', 'total')
      .addSelect('p.name', 'name')
      .leftJoin(Product, 'p', 'p.id = po.product_id')
      .leftJoin(Order, 'o', 'o.id = po.order_id');

    if (userId !== 0) {
      sql = sql.where('o.agency_id = :userId', { userId });
    }

    let query = await sql.groupBy('p.name').getRawMany();
    res = query;
    return query;
  }
}
