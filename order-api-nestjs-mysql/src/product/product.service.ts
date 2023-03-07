import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        public readonly productRepo: Repository<ProductEntity>,
      ) {}
    
      async findAll (): Promise<ProductEntity[]> {
        return await this.productRepo.find();
      }
    
      async findOne (id: number): Promise<ProductEntity> {
        return await this.productRepo.findOne({
            where: {
                id
            },
        })
      }
    
      async create (entity: ProductEntity): Promise<ProductEntity> {
        return await this.productRepo.save(entity)
      }
    
      async update(entity: ProductEntity): Promise<UpdateResult> {
        return await this.productRepo.update(entity.id, entity);
      }
    
      async delete(id): Promise<DeleteResult> {
        return await this.productRepo.delete(id);
      }
}
