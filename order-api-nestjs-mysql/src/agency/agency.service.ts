import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
import { ModifyAgencyDto } from './dto/modify-agency.dto';
import { Agency } from './entities/agency.entity';
import { Users } from '../user/entities/user.entity';

@Injectable()
export class AgencyService {
    constructor(
        @InjectRepository(Agency)
        public readonly agencyRepo: Repository<Agency>,
        private readonly userService: UserService,
    ) { }

    async findAll(): Promise<Agency[]> {
        return await this.agencyRepo.find({
            where: {
                id: Not(1)
            },
        });
    }

    async findOne(id: number): Promise<Agency> {
        return await this.agencyRepo.findOne({
            where: {
                id: Not(1)
            },
        })
    }

    async create(modifyAgencyDto: ModifyAgencyDto): Promise<Agency> {
        const agencyEntity = this.mappingAgency(modifyAgencyDto);
        const agency = await this.agencyRepo.save(agencyEntity)

        const userEntity = {
            username: modifyAgencyDto.accountName,
            password: modifyAgencyDto.password,
            isAdmin: false,
            token: '',
            expiresAt: 0
        }
        const user = await this.userService.create(userEntity);
        agency.userId = user.id;
        return agency;
    }

    async update(modifyAgencyDto: ModifyAgencyDto): Promise<UpdateResult> {
        const agency = this.mappingAgency(modifyAgencyDto);
        return await this.agencyRepo.update(modifyAgencyDto.id, agency);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.agencyRepo.delete(id);
    }

    private mappingAgency(modifyAgencyDto: ModifyAgencyDto): Agency {
        const agency = new Agency();
        agency.fullName = modifyAgencyDto.fullName;
        agency.address = modifyAgencyDto.address;
        agency.contract = modifyAgencyDto.contract;
        agency.note = modifyAgencyDto.note;
        agency.email = modifyAgencyDto.email;
        agency.userId = modifyAgencyDto.userId;
        agency.phone = modifyAgencyDto.phone;
        console.log(agency)
        return agency;
    }
}
