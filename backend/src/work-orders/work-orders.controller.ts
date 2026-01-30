import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { Company } from '../common/decorators/company.decorator';
import { WorkOrderStatus } from '@prisma/client';

@ApiTags('work-orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  create(@Company() companyId: string, @Body() dto: CreateWorkOrderDto) {
    return this.workOrdersService.create(companyId, dto);
  }

  @Get()
  findAll(@Company() companyId: string, @Query('status') status?: WorkOrderStatus) {
    return this.workOrdersService.findAll(companyId, status);
  }

  @Get(':id')
  findOne(@Company() companyId: string, @Param('id') id: string) {
    return this.workOrdersService.findOne(companyId, id);
  }

  @Patch(':id')
  update(@Company() companyId: string, @Param('id') id: string, @Body() dto: UpdateWorkOrderDto) {
    return this.workOrdersService.update(companyId, id, dto);
  }
}
