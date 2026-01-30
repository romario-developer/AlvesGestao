import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { Company } from '../common/decorators/company.decorator';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CompanyGuard)
  @Get('me')
  findMyCompany(@Company() companyId: string) {
    return this.companyService.findOne(companyId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CompanyGuard)
  @Patch(':id')
  update(@Company() companyId: string, @Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    if (companyId !== id) {
      throw new Error('Só é possível editar a própria empresa no cabeçalho');
    }
    return this.companyService.update(id, dto);
  }
}
