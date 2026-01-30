import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export type PaymentMethodType = 'PIX' | 'DEBITO' | 'CREDITO' | 'DINHEIRO' | 'BOLETO' | 'OUTROS';

export type DashboardOverviewData = {
  company: {
    id: string;
    nomeFantasia: string;
    plano: string | null;
    createdAt: string;
  };
  user: {
    id: string;
    nome: string;
    role: string;
  };
  vendas: {
    totalPagoMes: number;
    porMetodo: Record<PaymentMethodType, number>;
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

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: async () => {
      const { data } = await api.get<DashboardOverviewData>('/dashboard/overview');
      return data;
    },
  });
}
