import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() 
  level: number;

  @Column({name: 'route_link', length: 50})
  routeLink: string;

  @Column({ length: 200})
  label: string;

  @Column({ length: 100})
  icon: string;

  @Column('is_admin')
  isAdmin: boolean;
}