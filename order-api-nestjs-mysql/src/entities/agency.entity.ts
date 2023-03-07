import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AgencyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  userId: number;

  @Column({ length: 500 }) 
  address: string;

  @Column({ length: 12 }) 
  phone: string;

  @Column({ length: 500 }) 
  note: string;

  @Column({ length: 200 }) 
  email: string;

  @Column({ length: 200 }) 
  contract: string;
}