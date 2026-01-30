import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServicePackageDto, PackageItem } from './dto/create-service-package.dto';
import { UpdateServicePackageDto } from './dto/update-service-package.dto';

@Injectable()
export class ServicePackagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, dto: CreateServicePackageDto) {
    return this.prisma.$transaction(async (trx) => {
      const pkg = await trx.servicePackage.create({
        data: {
          companyId,
          nome: dto.nome,
          descricao: dto.descricao,
          precoBase: dto.precoBase,
        },
      });

      if (dto.items?.length) {
        await trx.servicePackageItem.createMany({
          data: dto.items.map((item: PackageItem) => ({
            servicePackageId: pkg.id,
            serviceId: item.serviceId,
            quantidade: item.quantidade ?? 1,
          })),
        });
      }

      return trx.servicePackage.findUnique({
        where: { id: pkg.id },
        include: { items: { include: { service: true } } },
      });
    });
  }

  findAll(companyId: string) {
    return this.prisma.servicePackage.findMany({
      where: { companyId },
      include: { items: { include: { service: true } } },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const pkg = await this.prisma.servicePackage.findFirst({
      where: { companyId, id },
      include: { items: { include: { service: true } } },
    });
    if (!pkg) {
      throw new NotFoundException('Pacote não encontrado');
    }
    return pkg;
  }

  async update(companyId: string, id: string, dto: UpdateServicePackageDto) {
    return this.prisma.$transaction(async (trx) => {
      const found = await trx.servicePackage.findFirst({ where: { companyId, id } });
      if (!found) throw new NotFoundException('Pacote não encontrado');

      const pkg = await trx.servicePackage.update({
        where: { id },
        data: {
          nome: dto.nome ?? found.nome,
          descricao: dto.descricao ?? found.descricao,
          precoBase: dto.precoBase ?? found.precoBase,
        },
      });

      if (dto.items) {
        await trx.servicePackageItem.deleteMany({ where: { servicePackageId: id } });
        await trx.servicePackageItem.createMany({
          data: dto.items.map((item: PackageItem) => ({
            servicePackageId: id,
            serviceId: item.serviceId,
            quantidade: item.quantidade ?? 1,
          })),
        });
      }

      return trx.servicePackage.findUnique({
        where: { id: pkg.id },
        include: { items: { include: { service: true } } },
      });
    });
  }
}
