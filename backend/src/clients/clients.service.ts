import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(companyId: string, dto: CreateClientDto) {
    return this.prisma.client.create({
      data: { ...dto, companyId, tags: dto.tags ?? [] },
    });
  }

  findAll(companyId: string, search?: string) {
    return this.prisma.client.findMany({
      where: {
        companyId,
        OR: search
          ? [
              { nomeCompleto: { contains: search, mode: 'insensitive' } },
              { whatsapp: { contains: search } },
              { telefone: { contains: search } },
              { email: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: { nomeCompleto: 'asc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { companyId, id },
      include: { vehicles: true },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return client;
  }

  async update(companyId: string, id: string, dto: UpdateClientDto) {
    await this.findOne(companyId, id);
    return this.prisma.client.update({
      where: { id },
      data: { ...dto, tags: dto.tags },
    });
  }
}
