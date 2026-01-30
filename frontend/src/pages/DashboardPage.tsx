import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/auth-store';
import { useDashboardOverview, type PaymentMethodType } from '../hooks/useDashboardOverview';

const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  PIX: 'PIX',
  DEBITO: 'Débito',
  CREDITO: 'Crédito',
  DINHEIRO: 'Dinheiro',
  BOLETO: 'Boleto',
  OUTROS: 'Outros',
};

const PAYMENT_METHOD_KEYS: PaymentMethodType[] = ['PIX', 'DEBITO', 'CREDITO', 'DINHEIRO', 'BOLETO', 'OUTROS'];

const ACTIONS = [
  { label: 'Nova Venda', to: '/work-orders/new' },
  { label: 'Novo Agendamento', to: '/appointments/new' },
  { label: 'Novo Orçamento', to: '/work-orders/new?mode=orcamento' },
  { label: 'Preencher Vaga', to: '/spaces' },
];

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function MonthCalendar() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startWeekDay = firstOfMonth.getDay();
  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = Array(startWeekDay).fill(null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(today);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold capitalize">{monthLabel}</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">Calendário mensal</span>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {weeks.map((week, index) => (
          <Fragment key={index}>
            {week.map((day, idx) => {
              const isToday = day === today.getDate();
              return (
                <div
                  key={`${index}-${idx}`}
                  className={`h-10 flex items-center justify-center rounded-xl ${
                    day
                      ? isToday
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-900 text-slate-200'
                      : 'bg-transparent'
                  }`}
                >
                  {day || ''}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  });
}

function formatDateLabel(date: Date) {
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
  return `Hoje é dia ${day} de ${month}, ${weekday}`;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboardOverview();
  const userName = useAuthStore((state) => state.userName ?? 'Usuário');
  const today = new Date();

  const greeting = `Olá, ${userName}, bom dia!`;
  const dateLabel = formatDateLabel(today);

  const cardsData = [
    {
      title: 'Resumo das vendas',
      content: (
        <>
          <p className="text-sm text-slate-400">Total pago no mês</p>
          <h3 className="text-3xl font-semibold text-emerald-400">
            {isLoading ? 'Carregando...' : formatCurrency(data?.vendas.totalPagoMes ?? 0)}
          </h3>
          <div className="mt-3 space-y-1 text-xs">
            {PAYMENT_METHOD_KEYS.map((method) => (
              <div key={method} className="flex items-center justify-between text-slate-400">
                <span>{PAYMENT_METHOD_LABELS[method]}</span>
                <span>{formatCurrency(data?.vendas.porMetodo?.[method] ?? 0)}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      title: 'Financeiro (hoje)',
      content: (
        <div className="space-y-2 text-sm text-slate-100">
          <div className="flex items-center justify-between">
            <span>Entradas hoje</span>
            <strong>{formatCurrency(data?.financeiro.entradasHoje ?? 0)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Saídas hoje</span>
            <strong>{formatCurrency(data?.financeiro.saidasHoje ?? 0)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Saldo estimado no mês</span>
            <strong>{formatCurrency(data?.financeiro.saldoEstimado ?? 0)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Faturas de cartão</span>
            <strong>{formatCurrency(data?.financeiro.totalFaturasCartao ?? 0)}</strong>
          </div>
        </div>
      ),
    },
    {
      title: 'Orçamentos (mês)',
      content: (
        <div className="space-y-2 text-sm text-slate-100">
          <div className="flex items-center justify-between">
            <span>Pendentes</span>
            <strong>{data?.orcamentos.orcPendentes ?? 0}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Aprovados</span>
            <strong>{data?.orcamentos.orcAprovados ?? 0}</strong>
          </div>
        </div>
      ),
    },
    {
      title: 'Vagas no espaço',
      content: (
        <div className="space-y-2 text-sm text-slate-100">
          <div className="flex items-center justify-between">
            <span>Vagas totais</span>
            <strong>{data?.vagas.totalVagas ?? 0}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Ocupadas agora</span>
            <strong>{data?.vagas.vagasOcupadasAgora ?? 0}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Concluídas hoje</span>
            <strong>{data?.vagas.vagasConcluidasHoje ?? 0}</strong>
          </div>
        </div>
      ),
    },
    {
      title: 'Pós-venda (hoje)',
      content: (
        <div className="space-y-2 text-sm text-slate-100">
          <div className="flex items-center justify-between">
            <span>Contatos pendentes</span>
            <strong>{data?.posVenda.contatosPendentesHoje ?? 0}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Realizados</span>
            <strong>{data?.posVenda.posVendasRealizadasHoje ?? 0}</strong>
          </div>
        </div>
      ),
    },
    {
      title: 'Sua empresa',
      content: (
        <div className="space-y-2 text-sm text-slate-100">
          <p className="text-lg font-semibold text-emerald-400">{data?.company.nomeFantasia ?? '--'}</p>
          <p>Plano: {data?.company.plano ?? 'Padrão'}</p>
          <p>Fundada em: {data ? new Date(data.company.createdAt).toLocaleDateString('pt-BR') : '--'}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-4">
        <div>
          <p className="text-lg text-slate-400">{greeting}</p>
          <h2 className="text-2xl font-semibold text-white">{dateLabel}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.to)}
              className="btn btn-primary text-sm"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="card p-4">
          <MonthCalendar />
        </div>
        <div className="card p-4 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Indicadores rápidos</p>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Atualizado ao vivo</p>
            <p className="text-2xl font-semibold text-emerald-400">
              {isLoading ? 'Carregando...' : formatCurrency(data?.vendas.totalPagoMes ?? 0)}
            </p>
            <p className="text-sm text-slate-400">Agendamentos em aberto e pós-venda</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cardsData.slice(0, 2).map((card) => (
          <div key={card.title} className="card p-4 space-y-3">
            <p className="text-sm text-slate-400 uppercase tracking-wide">{card.title}</p>
            {card.content}
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cardsData.slice(2).map((card) => (
          <div key={card.title} className="card p-4 space-y-3">
            <p className="text-sm text-slate-400 uppercase tracking-wide">{card.title}</p>
            {card.content}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400 uppercase tracking-wide">Top 5 clientes (mês)</p>
            <span className="text-xs text-slate-500">Ordenados por gasto</span>
          </div>
          {isLoading && <p className="text-sm text-slate-500">Carregando...</p>}
          {!isLoading && !data?.topClientes.length && (
            <p className="text-sm text-slate-500">Ainda não há clientes faturando neste mês.</p>
          )}
          <div className="space-y-3">
            {data?.topClientes.map((client) => (
              <div key={client.clientId} className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 p-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-400">{client.nomeCompleto}</p>
                  <p className="text-xs text-slate-500">Serviços: {client.qtdeServicos}</p>
                </div>
                <p className="text-sm font-semibold">{formatCurrency(client.totalGasto)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4 space-y-3">
          <p className="text-sm text-slate-400 uppercase tracking-wide">Resumo da empresa</p>
          <div className="space-y-1 text-sm text-slate-100">
            <p>Plano atual: {data?.company.plano ?? 'Plano básico'}</p>
            <p>Integrou em: {data ? new Date(data.company.createdAt).toLocaleDateString('pt-BR') : '--'}</p>
            <p>Usuário: {data?.user.nome ?? userName}</p>
          </div>
          <div className="space-y-1 text-sm text-slate-400">
            <p>Mais cards de finança, agendas e pós-venda em breve.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
