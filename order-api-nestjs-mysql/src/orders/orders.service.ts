import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Raw, Repository, UpdateResult } from 'typeorm';
import { ModifyOrderDto } from './dto/modify-order.dto';
import { Order } from './entities/order.entity';
import { SearchOrderDto } from './dto/search-order.dto';
import { OrderRo } from './ro/order.ro';
import { ProductOrder } from './entities/product-order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    public readonly productRepo: Repository<Order>,
    @InjectRepository(ProductOrder)
    public readonly productOrderRepo: Repository<ProductOrder>,
  ) { }

  async findAll(): Promise<OrderRo> {
    const response = new OrderRo;
    const orderList = await this.productRepo.find();
    const productOrderList = await this.productOrderRepo.find();
    response.ordersList = orderList;
    response.productOrderList = productOrderList;
    return response;
  }

  async findOne(id: number): Promise<OrderRo> {
    const response = new OrderRo;
    const orderList = await this.productRepo.find({
      where: {
        id
      },
    });
    const productOrderList = await this.productOrderRepo.find();
    response.ordersList = orderList;
    response.productOrderList = productOrderList;
    return response;
  }

  async create(modifyOrderDto: ModifyOrderDto): Promise<Order> {
    const product = this.mappingOrder(modifyOrderDto);
    return await this.productRepo.save(product)
  }

  async update(modifyOrderDto: ModifyOrderDto): Promise<UpdateResult> {
    const product = this.mappingOrder(modifyOrderDto);
    return await this.productRepo.update(modifyOrderDto.id, product);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.productRepo.delete(id);
  }

  async search(searchOderDto: SearchOrderDto): Promise<OrderRo> {
    const response = new OrderRo;
    const orderList = await this.productRepo.find({
      where: [
        { id: searchOderDto.orderId },
        { agencyId: searchOderDto.agencyId },
        { status: searchOderDto.status },
        {
          createdDate: Raw((alias) => `${alias} >= :date1 AND ${alias} <= :date2`, { date1: searchOderDto.startDate, date2: searchOderDto.endDate }),
        },
      ]
    });
    const productOrderList = await this.productOrderRepo.find({
      where: [
        { productId: searchOderDto.productId }
      ]
    });
    response.ordersList = orderList;
    response.productOrderList = productOrderList;
    return response;
  }

  private mappingOrder(modifyOrderDto: ModifyOrderDto): Order {
    const order = new Order();
    // order.agencyId = modifyOrderDto.;
    // order.quantity = modifyOrderDto.quantity;
    // order.price = modifyOrderDto.price;
    // order.note = modifyOrderDto.note;
    // if (modifyOrderDto.id && modifyOrderDto.id !== 0) {
    //   order.updatedDate = moment().format('DD/MM/YYYY');
    // } else {
    //   order.createdDate = moment().format('DD/MM/YYYY');
    // }
    console.log(order)
    return order;
  }
}

