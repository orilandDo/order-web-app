import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 }) 
  username: string;

  @Column({length: 50})
  password: string;

  @Column('is_admin')
  isAdmin: boolean;

  @Column('token')
  token: string;

  @Column('expires_at')
  expiresAt: number;
}