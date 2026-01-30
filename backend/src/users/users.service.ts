import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async findByEmailGlobal(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { company: { select: { id: true, nomeFantasia: true } } },
    });
  }

  async findByEmail(companyId: string, email: string) {
    return this.prisma.user.findFirst({ where: { companyId, email } });
  }

  findAll(companyId: string) {
    return this.prisma.user.findMany({ where: { companyId } });
  }

  async findOne(companyId: string, id: string) {
    const user = await this.prisma.user.findFirst({ where: { companyId, id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async update(companyId: string, id: string, data: UpdateUserDto) {
    await this.findOne(companyId, id);
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(companyId: string, id: string) {
    await this.findOne(companyId, id);
    return this.prisma.user.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
