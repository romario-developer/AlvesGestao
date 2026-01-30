import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { Company } from '../common/decorators/company.decorator';

@ApiTags('vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Company() companyId: string, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(companyId, dto);
  }

  @Get()
  findAll(@Company() companyId: string, @Query('search') search?: string) {
    return this.vehiclesService.findByCompany(companyId, search);
  }

  @Get(':id')
  findOne(@Company() companyId: string, @Param('id') id: string) {
    return this.vehiclesService.findOne(companyId, id);
  }

  @Patch(':id')
  update(@Company() companyId: string, @Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(companyId, id, dto);
  }
}
