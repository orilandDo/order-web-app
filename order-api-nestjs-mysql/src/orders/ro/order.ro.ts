import { Order } from "../entities/order.entity";
import { ProductOrder } from "../entities/product-order.entity";

export class OrderRo {
    ordersList: Order[];
    productOrderList: ProductOrder[];
}