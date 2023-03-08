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
    public readonly orderRepo: Repository<Order>,
    @InjectRepository(ProductOrder)
    public readonly productOrderRepo: Repository<ProductOrder>,
  ) { }

  async findAll(): Promise<OrderRo> {
    const response = new OrderRo;
    const orderList = await this.orderRepo.find();
    const productOrderList = await this.productOrderRepo.find();
    response.ordersList = orderList;
    response.productOrderList = productOrderList;
    return response;
  }

  async findOne(id: number): Promise<OrderRo> {
    const response = new OrderRo;
    const orderList = await this.orderRepo.find({
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
    const order = await this.orderRepo.save(product);
    const entities: ProductOrder[] = [];
    modifyOrderDto.products.forEach(element => {
      const item = new ProductOrder();
      item.orderId = order.id;
      item.productId = element.id;
      item.quantity = element.quantity;
    });
    await this.productOrderRepo.save(entities);
    return order;
  }

  async update(modifyOrderDto: ModifyOrderDto): Promise<UpdateResult> {
    const product = this.mappingOrder(modifyOrderDto);
    modifyOrderDto.products.forEach(async element => {
      await this.productOrderRepo.createQueryBuilder()
        .update(ProductOrder)
        .set({ quantity: element.quantity })
        .where("order_id = :orderId", { orderId: modifyOrderDto.id })
        .andWhere("product_id = :productId", { productId: element.id })
        .execute();
    })
    return await this.orderRepo.update(modifyOrderDto.id, product);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.productOrderRepo.createQueryBuilder()
      .softDelete()
      .where("order_id = :id", { id })
      .execute();
    return await this.orderRepo.delete(id);
  }

  async search(searchOderDto: SearchOrderDto): Promise<OrderRo> {
    const response = new OrderRo;
    const orderLists = await this.orderRepo.find({
      where: [
        { id: searchOderDto.orderId },
        { agencyId: searchOderDto.agencyId },
        { status: searchOderDto.status },
        {
          createdDate: Raw((alias) => `${alias} >= :date1 AND ${alias} <= :date2`, { date1: searchOderDto.startDate, date2: searchOderDto.endDate }),
        },
      ]
    });

    let sql = this.orderRepo.createQueryBuilder('order')
    .select('order')
    .addSelect('productOrder')
    .leftJoin(ProductOrder , 'productOrder', 'productOrder.order_id = order.id')
    .where('1=1');

    if (searchOderDto.orderId && searchOderDto.orderId !== 0) {
      sql = sql.andWhere('order.id = :orderId', { orderId: searchOderDto.orderId})
    } else if (searchOderDto.agencyId && searchOderDto.agencyId !== 0) {
      sql = sql.andWhere('order.agency_id = :agencyId', { agencyId: searchOderDto.agencyId})
    } else if (searchOderDto.status && searchOderDto.status !== 0) {
      sql = sql.andWhere('order.status = :status', { status: searchOderDto.status})
    } else if (searchOderDto.productId && searchOderDto.productId !== 0) {
      sql = sql.andWhere('productOrder.product_id = :productId', { productId: searchOderDto.productId})
    } else if (searchOderDto.startDate.length !== 0 && searchOderDto.endDate.length !== 0) {
      sql = sql.andWhere('order.created_date BETWEEN :start AND :end ', { start: searchOderDto.startDate, end: searchOderDto.endDate})
    }
    const orderList = await sql.getRawMany();
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
    order.createdDate = modifyOrderDto.createdDate;
    order.deliveryId = modifyOrderDto.deliveryId;
    order.pickupId = modifyOrderDto.pickupId;
    order.productTotal = modifyOrderDto.productTotal;
    order.driver = modifyOrderDto.driver;
    order.note = modifyOrderDto.note;
    order.transport = modifyOrderDto.transport;
    order.licensePlates = modifyOrderDto.licensePlates;
    order.receivedDate = modifyOrderDto.receivedDate;
    order.status = modifyOrderDto.status;
    order.note = modifyOrderDto.note;
    order.contract = modifyOrderDto.contract;
    order.agencyId = modifyOrderDto.agencyId;
    console.log(order)
    return order;
  }
}

