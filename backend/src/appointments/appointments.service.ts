import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(companyId: string, dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        companyId,
        clientId: dto.clientId,
        vehicleId: dto.vehicleId,
        serviceId: dto.serviceId,
        dataHoraInicio: new Date(dto.dataHoraInicio),
        dataHoraFim: new Date(dto.dataHoraFim),
        status: dto.status ?? AppointmentStatus.AGENDADO,
        origem: dto.origem,
        observacoes: dto.observacoes,
        responsavelId: dto.responsavelId,
      },
      include: {
        client: true,
        vehicle: true,
        service: true,
        responsavel: true,
      },
    });
  }

  findAll(companyId: string, dateStart?: string, dateEnd?: string) {
    return this.prisma.appointment.findMany({
      where: {
        companyId,
        AND: [
          dateStart ? { dataHoraInicio: { gte: new Date(dateStart) } } : {},
          dateEnd ? { dataHoraFim: { lte: new Date(dateEnd) } } : {},
        ],
      },
      orderBy: { dataHoraInicio: 'asc' },
      include: {
        client: true,
        vehicle: true,
        service: true,
      },
    });
  }

  async findOne(companyId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { companyId, id },
      include: { client: true, vehicle: true, service: true, workOrder: true },
    });
    if (!appointment) throw new NotFoundException('Agendamento não encontrado');
    return appointment;
  }

  async update(companyId: string, id: string, dto: UpdateAppointmentDto) {
    await this.findOne(companyId, id);
    return this.prisma.appointment.update({
      where: { id },
      data: {
        ...dto,
        dataHoraInicio: dto.dataHoraInicio ? new Date(dto.dataHoraInicio) : undefined,
        dataHoraFim: dto.dataHoraFim ? new Date(dto.dataHoraFim) : undefined,
      },
      include: { client: true, vehicle: true, service: true },
    });
  }
}
