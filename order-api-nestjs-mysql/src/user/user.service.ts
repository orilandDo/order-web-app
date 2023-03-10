import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
import { Users } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        public readonly userRepo: Repository<Users>,
    ) { }

    async findAll(): Promise<Users[]> {
        return await this.userRepo.find();
    }

    async findOne(id: number): Promise<Users> {
        return await this.userRepo.findOne({
            where: {
                id
            },
        })
    }

    async findByNamePassword(username: string, password: string): Promise<Users> {
        const user = await this.userRepo.findOne({
            where: {
                username, password
            },
        });
        return user;
    }

    async create(user: Users | any): Promise<Users> {
        return await this.userRepo.save(user)
    }

    async updatePassword(users: Users): Promise<UpdateResult> {
        return await this.userRepo.createQueryBuilder()
            .update(Users)
            .set({ password: users.password })
            .where("id = :id", { id: users.id })
            .execute()
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.userRepo.delete(id);
    }
}
