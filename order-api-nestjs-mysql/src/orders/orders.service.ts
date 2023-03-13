import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Raw, Repository, UpdateResult } from 'typeorm';
import { ModifyOrderDto } from './dto/modify-order.dto';
import { Order } from './entities/order.entity';
import { SearchOrderDto } from './dto/search-order.dto';
import { ProductOrder } from './entities/product-order.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    public readonly orderRepo: Repository<Order>,
    @InjectRepository(ProductOrder)
    public readonly productOrderRepo: Repository<ProductOrder>,
    private readonly productService: ProductsService,
  ) { }

  async findAll(userId: number): Promise<Order[]> {
    let response: Order[] = [];
    let orderList: any;
    if (userId !== 0) {
      orderList = await this.orderRepo.find({
        where: {
          agencyId: userId
        }
      });
    } else {
      orderList = await this.orderRepo.find();
    }
    response = orderList;
    const productList = await this.productService.findAll();
    const productOrderList = await this.productOrderRepo.find();
    orderList.forEach(el => {
      el.products = [];
      const items = productOrderList.filter(x => x.orderId === el.id);
      if (items.length > 0) {
        items.forEach(i => {
          const temp = {
            id: i.productId,
            name: productList.find(x => x.id === i.productId).name,
            quantity: i.quantity,
          };
          el.products.push(temp);
        });
      }
    });
    return response;
  }

  async findOne(id: number, userId: number): Promise<Order> {
    let response = new Order();
    // const orderList = await this.orderRepo.findOneBy({ id });
    let orderList: any;
    if (userId !== 0) {
      orderList = await this.orderRepo.find({
        where: {
          id,
          agencyId: userId
        }
      });
    } else {
      orderList = await this.orderRepo.findOneBy({ id });
    }
    response = orderList;
    const productList = await this.productService.findAll();
    const productOrderList = await this.productOrderRepo.find();
    const items = productOrderList.filter(x => x.orderId === response.id);
    if (items.length > 0) {
      items.forEach(i => {
        const temp = {
          id: i.productId,
          name: productList.find(x => x.id === i.productId).name,
          quantity: i.quantity,
        };
        response.products.push(temp);
      });
    }
    return response;
  }

  async create(modifyOrderDto: ModifyOrderDto): Promise<ModifyOrderDto> {
    const orderEntity = this.mappingOrder(modifyOrderDto);
    const order = await this.orderRepo.save(orderEntity);
    const entities: ProductOrder[] = [];
    modifyOrderDto.products.forEach(element => {
      const item = new ProductOrder();
      item.orderId = order.id;
      item.productId = element.id;
      item.quantity = element.quantity;
      entities.push(item);
    });
    await this.productOrderRepo.save(entities);
    modifyOrderDto.id = order.id;
    return modifyOrderDto;
  }

  async update(modifyOrderDto: ModifyOrderDto): Promise<UpdateResult | any> {
    const orderOld = await this.orderRepo.findOneBy({id: modifyOrderDto.id});
    if (orderOld.status > 1 && !modifyOrderDto.isAdmin) {
      return { code: 404, error: 'Not allow update'}
    }
    const order = this.mappingOrder(modifyOrderDto);
    modifyOrderDto.products.forEach(async element => {
      await this.productOrderRepo.createQueryBuilder()
        .update(ProductOrder)
        .set({ quantity: element.quantity })
        .where("order_id = :orderId", { orderId: modifyOrderDto.id })
        .andWhere("product_id = :productId", { productId: element.id })
        .execute();
    })
    return await this.orderRepo.update(modifyOrderDto.id, order);
  }

  async updateStatus(body: any) {
    return await this.orderRepo.createQueryBuilder()
      .update(Order)
      .set({ status: body.status })
      .where("id = :orderId", { orderId: body.id })
      .execute();
  }

  async updateView(body: any) {
    return await this.orderRepo.createQueryBuilder()
      .update(Order)
      .set({ isViewed: body.isViewed })
      .where("id = :orderId", { orderId: body.id })
      .execute();
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.productOrderRepo.createQueryBuilder()
      .softDelete()
      .where("order_id = :id", { id })
      .execute();
    return await this.orderRepo.delete(id);
  }

  async search(searchOderDto: SearchOrderDto): Promise<Order[]> {
    let response: Order[] = [];
    const productList = await this.productService.findAll();

    let sql = this.orderRepo.createQueryBuilder('order')
      .select('order')
      .addSelect('productOrder')
      .leftJoin(ProductOrder, 'productOrder', 'productOrder.order_id = order.id')
      .where('1=1');

    if (searchOderDto.userId && searchOderDto.userId !== 0) {
      sql = sql.andWhere('order.agencyId = :agencyId', { agencyId: searchOderDto.userId })
    }
    if (searchOderDto.orderId && searchOderDto.orderId !== 0) {
      sql = sql.andWhere('order.id = :orderId', { orderId: searchOderDto.orderId })
    }
    if (searchOderDto.agencyId && searchOderDto.agencyId !== 0) {
      sql = sql.andWhere('order.agency_id = :agencyId', { agencyId: searchOderDto.agencyId })
    }
    if (searchOderDto.status && searchOderDto.status !== 0) {
      sql = sql.andWhere('order.status = :status', { status: searchOderDto.status })
    }
    if (searchOderDto.productId && searchOderDto.productId !== 0) {
      sql = sql.andWhere('productOrder.product_id = :productId', { productId: searchOderDto.productId })
    }
    if (searchOderDto.startDate && searchOderDto.startDate.length !== 0
      && searchOderDto.endDate && searchOderDto.endDate.length !== 0) {
      sql = sql.andWhere('order.created_date BETWEEN :start AND :end ', { start: searchOderDto.startDate, end: searchOderDto.endDate })
    }
    const orderList = await sql.getRawMany();
    console.log(sql.getSql())
    console.log(orderList)

    const dataMap = this.mappingSearch(orderList, productList);
    response = dataMap;
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
    order.isViewed = modifyOrderDto.isViewed;
    console.log(order)
    return order;
  }

  private mappingSearch(data: any[], productList: any[]) {
    let list1: Order[] = [];
    data.forEach(el => {
      const item = new Order();
      item.id = el.order_id;
      item.agencyId = el.order_agency_id;
      item.createdDate = el.order_created_date;
      item.deliveryId = el.order_delivery_id;
      item.productTotal = el.order_product_total;
      item.transport = el.order_transport;
      item.licensePlates = el.order_license_plates;
      item.driver = el.order_driver;
      item.receivedDate = el.order_received_date;
      item.status = el.order_status;
      item.note = el.order_note;
      item.contract = el.order_contract;
      item.products = [];
      item.isViewed = el.isViewed;
      list1.push(item);
    });

    // Bo phan tu trung nhau
    const ids = list1.map(o => o.id);
    list1 = list1.filter(({ id }, index) => !ids.includes(id, index + 1));

    list1.forEach(el => {
      const proList = data.filter(x => x.order_id === el.id);
      if (proList.length > 0) {
        proList.forEach(i => {
          const item2 = {
            id: i.productOrder_product_id,
            quantity: i.productOrder_quantity,
            name: productList.find(x => x.id === i.productOrder_product_id).name,
          }
          el.products.push(item2);
        });
      }
    });

    return list1;
  }
}

