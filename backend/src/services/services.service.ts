import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(companyId: string, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        companyId,
        ...dto,
      },
    });
  }

  findAll(companyId: string, search?: string) {
    return this.prisma.service.findMany({
      where: {
        companyId,
        OR: search
          ? [
              { nome: { contains: search, mode: 'insensitive' } },
              { categoria: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const service = await this.prisma.service.findFirst({
      where: { companyId, id },
    });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }
    return service;
  }

  async update(companyId: string, id: string, dto: UpdateServiceDto) {
    await this.findOne(companyId, id);
    return this.prisma.service.update({ where: { id }, data: dto });
  }
}
