import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServicePackagesService } from './service-packages.service';
import { CreateServicePackageDto } from './dto/create-service-package.dto';
import { UpdateServicePackageDto } from './dto/update-service-package.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { Company } from '../common/decorators/company.decorator';

@ApiTags('service-packages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('service-packages')
export class ServicePackagesController {
  constructor(private readonly servicePackagesService: ServicePackagesService) {}

  @Post()
  create(@Company() companyId: string, @Body() dto: CreateServicePackageDto) {
    return this.servicePackagesService.create(companyId, dto);
  }

  @Get()
  findAll(@Company() companyId: string) {
    return this.servicePackagesService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Company() companyId: string, @Param('id') id: string) {
    return this.servicePackagesService.findOne(companyId, id);
  }

  @Patch(':id')
  update(@Company() companyId: string, @Param('id') id: string, @Body() dto: UpdateServicePackageDto) {
    return this.servicePackagesService.update(companyId, id, dto);
  }
}
