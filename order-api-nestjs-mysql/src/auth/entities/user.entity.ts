import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 }) 
  username: string;

  @Column({length: 50})
  password: string;

  @Column({name: 'is_admin'})
  isAdmin: boolean;

  @Column({name: 'token'})
  token: string;

  @Column({name: 'expires_at'})
  expiresAt: number;
}