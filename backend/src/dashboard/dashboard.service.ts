import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethod, WorkOrderStatus, FollowUpStatus, UserRole } from '@prisma/client';

export type DashboardUserPayload = {
  companyId: string;
  userId: string;
  role: UserRole;
  userName: string;
};

export type DashboardOverview = {
  user: { id: string; nome: string; role: UserRole };
  company: {
    id: string;
    nomeFantasia: string;
    plano: string | null;
    createdAt: string;
  };
  vendas: {
    totalPagoMes: number;
    porMetodo: Record<'PIX' | 'DEBITO' | 'CREDITO' | 'DINHEIRO' | 'BOLETO' | 'OUTROS', number>;
  };
  financeiro: {
    entradasHoje: number;
    saidasHoje: number;
    saldoEstimado: number;
    totalFaturasCartao: number;
  };
  orcamentos: {
    orcPendentes: number;
    orcAprovados: number;
  };
  vagas: {
    totalVagas: number;
    vagasOcupadasAgora: number;
    vagasConcluidasHoje: number;
  };
  posVenda: {
    contatosPendentesHoje: number;
    posVendasRealizadasHoje: number;
  };
  topClientes: {
    clientId: string;
    nomeCompleto: string;
    totalGasto: number;
    qtdeServicos: number;
  }[];
};

type PaymentMethodMap = Record<'PIX' | 'DEBITO' | 'CREDITO' | 'DINHEIRO' | 'BOLETO' | 'OUTROS', number>;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}
function decToNumber(v: any) {
  if (!v) return 0;
  return typeof v === 'number' ? v : parseFloat(v.toString());
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(input: DashboardUserPayload) {
    const { companyId, userId, role, userName } = input;

    const now = new Date();
    const dayStart = startOfDay(now);
    const dayEnd = endOfDay(now);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const byMethodBase: PaymentMethodMap = {
      PIX: 0,
      DEBITO: 0,
      CREDITO: 0,
      DINHEIRO: 0,
      BOLETO: 0,
      OUTROS: 0,
    };

    // Company
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, nomeFantasia: true, plano: true, createdAt: true },
    });

    // Payments - month totals
    const paymentsMonthAgg = await this.prisma.payment.aggregate({
      where: {
        companyId,
        dataPagamento: { gte: monthStart, lte: monthEnd },
      },
      _sum: { valor: true },
    });

    const paymentsByMethod = await this.prisma.payment.groupBy({
      by: ['metodo'],
      where: {
        companyId,
        dataPagamento: { gte: monthStart, lte: monthEnd },
      },
      _sum: { valor: true },
    });

    const porMetodo: PaymentMethodMap = { ...byMethodBase };
    for (const row of paymentsByMethod) {
      const key = row.metodo as PaymentMethod;
      if (key in porMetodo) porMetodo[key as keyof PaymentMethodMap] = decToNumber(row._sum.valor);
    }

    const totalPagoMes = decToNumber(paymentsMonthAgg._sum.valor);

    // Finance today
    const paymentsTodayAgg = await this.prisma.payment.aggregate({
      where: { companyId, dataPagamento: { gte: dayStart, lte: dayEnd } },
      _sum: { valor: true },
    });

    const payablesTodayAgg = await this.prisma.payable.aggregate({
      where: { companyId, dataPagamento: { gte: dayStart, lte: dayEnd }, valorPago: { not: null } },
      _sum: { valorPago: true },
    });

    const payablesMonthAgg = await this.prisma.payable.aggregate({
      where: { companyId, dataPagamento: { gte: monthStart, lte: monthEnd }, valorPago: { not: null } },
      _sum: { valorPago: true },
    });

    const creditMonthAgg = await this.prisma.payment.aggregate({
      where: { companyId, metodo: 'CREDITO', dataPagamento: { gte: monthStart, lte: monthEnd } },
      _sum: { valor: true },
    });

    const entradasHoje = decToNumber(paymentsTodayAgg._sum.valor);
    const saidasHoje = decToNumber(payablesTodayAgg._sum.valorPago);
    const saldoEstimado = totalPagoMes - decToNumber(payablesMonthAgg._sum.valorPago);
    const totalFaturasCartao = decToNumber(creditMonthAgg._sum.valor);

    // Budgets month
    const [orcPendentes, orcAprovados] = await Promise.all([
      this.prisma.workOrder.count({
        where: { companyId, status: WorkOrderStatus.ORCAMENTO, dataAbertura: { gte: monthStart, lte: monthEnd } },
      }),
      this.prisma.workOrder.count({
        where: {
          companyId,
          status: { in: [WorkOrderStatus.ABERTO, WorkOrderStatus.EM_EXECUCAO, WorkOrderStatus.CONCLUIDO] },
          dataAbertura: { gte: monthStart, lte: monthEnd },
        },
      }),
    ]);

    // Spaces
    const totalVagas = await this.prisma.space.count({ where: { companyId } });

    const vagasConcluidasHoje = await this.prisma.spaceAllocation.count({
      where: {
        space: { companyId },
        fim: { gte: dayStart, lte: dayEnd },
      },
    });

    const vagasOcupadasAgora = await this.prisma.spaceAllocation.count({
      where: {
        space: { companyId },
        inicio: { lte: now },
        fim: { gte: now }, // fim é obrigatório no schema atual
      },
    });

    // Follow-ups
    const [contatosPendentesHoje, posVendasRealizadasHoje] = await Promise.all([
      this.prisma.followUp.count({
        where: { companyId, status: FollowUpStatus.PENDENTE, dataContato: { gte: dayStart, lte: dayEnd } },
      }),
      this.prisma.followUp.count({
        where: { companyId, status: FollowUpStatus.CONCLUIDO, updatedAt: { gte: dayStart, lte: dayEnd } },
      }),
    ]);

    // Top clients (month) via Payments -> WorkOrder -> Client
    const topPaymentsByClient = await this.prisma.payment.groupBy({
      by: ['workOrderId'],
      where: {
        companyId,
        dataPagamento: { gte: monthStart, lte: monthEnd },
      },
      _sum: { valor: true },
    });

    // Map workOrderId -> total
    const workOrderTotals = topPaymentsByClient
      .map((x) => ({ workOrderId: x.workOrderId, total: decToNumber(x._sum.valor) }))
      .filter((x) => x.total > 0);

    // Load related workOrders (clientId) in one query
    const workOrderIds = workOrderTotals.map((x) => x.workOrderId);
    const workOrders = workOrderIds.length
      ? await this.prisma.workOrder.findMany({
          where: { id: { in: workOrderIds }, companyId },
          select: { id: true, clientId: true },
        })
      : [];

    const woToClient = new Map(workOrders.map((w) => [w.id, w.clientId]));
    const clientTotals = new Map<string, number>();

    for (const item of workOrderTotals) {
      const clientId = woToClient.get(item.workOrderId);
      if (!clientId) continue;
      clientTotals.set(clientId, (clientTotals.get(clientId) ?? 0) + item.total);
    }

    // Count workOrders per client (month)
    const workOrdersCountByClient = await this.prisma.workOrder.groupBy({
      by: ['clientId'],
      where: { companyId, dataAbertura: { gte: monthStart, lte: monthEnd } },
      _count: { _all: true },
    });
    const countMap = new Map(workOrdersCountByClient.map((x) => [x.clientId, x._count._all]));

    const topClientIds = [...clientTotals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([clientId]) => clientId);

    const clients = topClientIds.length
      ? await this.prisma.client.findMany({
          where: { id: { in: topClientIds }, companyId },
          select: { id: true, nomeCompleto: true },
        })
      : [];

    const clientNameMap = new Map(clients.map((c) => [c.id, c.nomeCompleto]));

    const topClientes = topClientIds.map((clientId) => ({
      clientId,
      nomeCompleto: clientNameMap.get(clientId) ?? 'Cliente',
      totalGasto: clientTotals.get(clientId) ?? 0,
      qtdeServicos: countMap.get(clientId) ?? 0,
    }));

    return {
      user: { id: userId, nome: userName, role },
      company: {
        id: company?.id ?? companyId,
        nomeFantasia: company?.nomeFantasia ?? '--',
        plano: company?.plano ?? null,
        createdAt: company?.createdAt?.toISOString?.() ?? new Date(0).toISOString(),
      },
      vendas: { totalPagoMes, porMetodo },
      financeiro: { entradasHoje, saidasHoje, saldoEstimado, totalFaturasCartao },
      orcamentos: { orcPendentes, orcAprovados },
      vagas: { totalVagas, vagasOcupadasAgora, vagasConcluidasHoje },
      posVenda: { contatosPendentesHoje, posVendasRealizadasHoje },
      topClientes,
    };
  }
}
