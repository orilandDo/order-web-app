import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'agency_id'})
  agencyId: number;

  @Column({ name: 'created_date', length: 12 }) 
  createdDate: string;

  @Column({ name: 'delivery_id'}) 
  deliveryId: number;

  @Column({ name: 'pickup_id'}) 
  pickupId: number;

  @Column({ name: 'product_total'}) 
  productTotal: number;

  @Column() 
  transport: number;

  @Column({ name: 'license_plates', length: 12}) 
  licensePlates: string;

  @Column({ length: 100 }) 
  driver: string;

  @Column({ name: 'received_date', length: 12}) 
  receivedDate: string;

  @Column() 
  status: number;

  @Column({ length: 500 }) 
  note: string;

  @Column({ length: 200 }) 
  contract: string;
}