import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 }) 
  name: string;

  @Column('quantity')
  quantity: number;

  @Column('price')
  price: number;

  @Column({length: 500})
  note: string;

  @Column('create_date')
  createDate: string;

  @Column('updated_date')
  updatedDate: string;
}