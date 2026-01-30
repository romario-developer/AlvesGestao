import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { Company } from '../common/decorators/company.decorator';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Company() companyId: string, @Body() dto: CreateClientDto) {
    return this.clientsService.create(companyId, dto);
  }

  @Get()
  findAll(@Company() companyId: string, @Query('search') search?: string) {
    return this.clientsService.findAll(companyId, search);
  }

  @Get(':id')
  findOne(@Company() companyId: string, @Param('id') id: string) {
    return this.clientsService.findOne(companyId, id);
  }

  @Patch(':id')
  update(@Company() companyId: string, @Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(companyId, id, dto);
  }
}
