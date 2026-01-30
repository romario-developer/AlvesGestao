import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { Company } from '../common/decorators/company.decorator';

@ApiTags('services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Company() companyId: string, @Body() dto: CreateServiceDto) {
    return this.servicesService.create(companyId, dto);
  }

  @Get()
  findAll(@Company() companyId: string, @Query('search') search?: string) {
    return this.servicesService.findAll(companyId, search);
  }

  @Get(':id')
  findOne(@Company() companyId: string, @Param('id') id: string) {
    return this.servicesService.findOne(companyId, id);
  }

  @Patch(':id')
  update(@Company() companyId: string, @Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(companyId, id, dto);
  }
}
