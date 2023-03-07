import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductOrderEntity {
  //@PrimaryGeneratedColumn()
  @Column('product_id') 
  productId: number;

  @Column('order_id') 
  orderId: number;

  @Column() 
  quantity: number;
}