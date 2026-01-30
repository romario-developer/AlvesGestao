import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkOrderDto, WorkOrderItemDto, PaymentDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { WorkOrderStatus, FollowUpStatus } from '@prisma/client';

@Injectable()
export class WorkOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private calcularTotais(items: WorkOrderItemDto[]) {
    const totalBruto = items.reduce((acc, item) => {
      const qty = item.quantidade ?? 1;
      return acc + item.precoUnitario * qty;
    }, 0);

    const descontoTotal = items.reduce((acc, item) => acc + (item.desconto ?? 0), 0);
    const acrescimoTotal = items.reduce((acc, item) => acc + (item.acrescimo ?? 0), 0);
    const totalLiquido = totalBruto - descontoTotal + acrescimoTotal;

    return { totalBruto, descontoTotal, totalLiquido };
  }

  async create(companyId: string, dto: CreateWorkOrderDto) {
    const status = dto.status ?? WorkOrderStatus.ORCAMENTO;

    return this.prisma.$transaction(async (trx) => {
      const last = await trx.workOrder.findFirst({
        where: { companyId },
        orderBy: { numeroSequencial: 'desc' },
        select: { numeroSequencial: true },
      });
      const sequencial = (last?.numeroSequencial ?? 0) + 1;

      const { totalBruto, descontoTotal, totalLiquido } = this.calcularTotais(dto.items);

      const workOrder = await trx.workOrder.create({
        data: {
          companyId,
          numeroSequencial: sequencial,
          clientId: dto.clientId,
          vehicleId: dto.vehicleId,
          status,
          totalBruto,
          descontoTotal,
          totalLiquido,
          formaRecebimento: dto.formaRecebimento,
          agendamentoId: dto.agendamentoId,
        },
      });

      await trx.workOrderItem.createMany({
        data: dto.items.map((item) => ({
          workOrderId: workOrder.id,
          serviceId: item.serviceId,
          quantidade: item.quantidade ?? 1,
          precoUnitario: item.precoUnitario,
          desconto: item.desconto ?? 0,
          acrescimo: item.acrescimo ?? 0,
        })),
      });

      let totalPago = 0;
      if (dto.payments?.length) {
        await trx.payment.createMany({
          data: dto.payments.map((p: PaymentDto) => ({
            workOrderId: workOrder.id,
            companyId,
            metodo: p.metodo,
            valor: p.valor,
            dataPagamento: p.dataPagamento ? new Date(p.dataPagamento) : new Date(),
            numeroParcela: p.numeroParcela,
            totalParcelas: p.totalParcelas,
          })),
        });
        totalPago = dto.payments.reduce((acc, p) => acc + p.valor, 0);
      }

      // Contas a receber se necessário
      if (totalPago < totalLiquido) {
        await trx.receivable.create({
          data: {
            companyId,
            clientId: dto.clientId,
            workOrderId: workOrder.id,
            valorPrevisto: totalLiquido - totalPago,
            dataPrevista: dto.receivableProjection
              ? new Date(dto.receivableProjection.dataPrevista)
              : new Date(),
            status: 'aberto',
          },
        });
      }

      // Pós-venda: gerar follow-ups para serviços com flag
      const servicesWithFollowUp = await trx.service.findMany({
        where: {
          id: { in: dto.items.map((i) => i.serviceId) },
          geraPosVenda: true,
          diasFollowUp: { not: null },
        },
      });
      if (servicesWithFollowUp.length) {
        const now = new Date();
        await trx.followUp.createMany({
          data: servicesWithFollowUp.map((servico) => ({
            companyId,
            workOrderId: workOrder.id,
            clientId: dto.clientId,
            serviceId: servico.id,
            dataContato: new Date(now.getTime() + (servico.diasFollowUp ?? 0) * 24 * 60 * 60 * 1000),
            status: FollowUpStatus.PENDENTE,
          })),
        });
      }

      return trx.workOrder.findUnique({
        where: { id: workOrder.id },
        include: {
          items: { include: { service: true } },
          payments: true,
          receivables: true,
        },
      });
    });
  }

  findAll(companyId: string, status?: WorkOrderStatus) {
    return this.prisma.workOrder.findMany({
      where: { companyId, status: status ?? undefined },
      orderBy: { dataAbertura: 'desc' },
      include: {
        client: true,
        vehicle: true,
        items: { include: { service: true } },
        payments: true,
        receivables: true,
      },
    });
  }

  async findOne(companyId: string, id: string) {
    const wo = await this.prisma.workOrder.findFirst({
      where: { companyId, id },
      include: {
        client: true,
        vehicle: true,
        items: { include: { service: true } },
        payments: true,
        receivables: true,
      },
    });
    if (!wo) throw new NotFoundException('OS não encontrada');
    return wo;
  }

  async update(companyId: string, id: string, dto: UpdateWorkOrderDto) {
    await this.findOne(companyId, id);
    return this.prisma.workOrder.update({
      where: { id },
      data: {
        status: dto.status,
        formaRecebimento: dto.formaRecebimento,
        dataConclusao: dto.status === WorkOrderStatus.CONCLUIDO ? new Date() : undefined,
      },
    });
  }
}
