import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AgencyController } from './agency.controller';
import { AgencyService } from './agency.service';
import { Agency } from './entities/agency.entity';

@Module({
  controllers: [AgencyController],
  imports: [TypeOrmModule.forFeature([Agency, Users])],
  providers: [AgencyService, UserService]
})
export class AgencyModule {}
