import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { ModifyAgencyDto } from './dto/modify-agency.dto';
import { Agency } from './entities/agency.entity';

@Controller('agency')
export class AgencyController {
    constructor(private readonly agencyService: AgencyService) {}
  
    @Get()
    findAll(): Promise<Agency[]> {
      return this.agencyService.findAll()
    }
  
    @Get(':id')
    get(@Param('id', ParseIntPipe) id: number): Promise<Agency> {
      return this.agencyService.findOne(id);
    }
  
    @Post()
    create(@Body() modifyAgencyDto: ModifyAgencyDto) {
      return this.agencyService.create(modifyAgencyDto);
    }
  
    @Put()
    update(@Body() modifyAgencyDto: ModifyAgencyDto) {
      return this.agencyService.update(modifyAgencyDto);
    }
  
    @Delete(':id')
    delete(@Param('id') id: number) {
      return this.agencyService.delete(id);
    }
}
