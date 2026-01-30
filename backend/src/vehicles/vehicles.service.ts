import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  create(companyId: string, dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: { ...dto, companyId },
    });
  }

  findByCompany(companyId: string, search?: string) {
    return this.prisma.vehicle.findMany({
      where: {
        companyId,
        OR: search
          ? [
              { placa: { contains: search, mode: 'insensitive' } },
              { modelo: { contains: search, mode: 'insensitive' } },
              { marca: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: { client: true },
    });
  }

  async findOne(companyId: string, id: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { companyId, id },
      include: { client: true },
    });
    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }
    return vehicle;
  }

  async update(companyId: string, id: string, dto: UpdateVehicleDto) {
    await this.findOne(companyId, id);
    return this.prisma.vehicle.update({ where: { id }, data: dto });
  }
}
