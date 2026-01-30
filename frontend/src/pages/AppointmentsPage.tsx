import { useForm } from 'react-hook-form';
import { useAppointments } from '../hooks/useAppointments';
import { useClients } from '../hooks/useClients';
import { useVehicles } from '../hooks/useVehicles';
import { useServices } from '../hooks/useServices';
import api from '../lib/api';

type AppointmentForm = {
  clientId: string;
  vehicleId: string;
  serviceId?: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status?: string;
  observacoes?: string;
};

export function AppointmentsPage() {
  const { data, isLoading, refetch } = useAppointments();
  const { data: clients } = useClients('');
  const { data: vehicles } = useVehicles('');
  const { data: services } = useServices('');
  const { register, handleSubmit, reset } = useForm<AppointmentForm>();

  const onSubmit = async (values: AppointmentForm) => {
    await api.post('/appointments', values);
    reset();
    refetch();
  };

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold">Agenda</h2>
        <p className="text-slate-400 text-sm">Crie agendamentos vinculados a cliente/veículo/serviço</p>
      </header>

      <div className="card p-4 space-y-3">
        <h3 className="font-semibold text-emerald-400">Novo Agendamento</h3>
        <form className="grid md:grid-cols-3 gap-3" onSubmit={handleSubmit(onSubmit)}>
          <select className="input" {...register('clientId', { required: true })}>
            <option value="">Cliente</option>
            {clients?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nomeCompleto}
              </option>
            ))}
          </select>
          <select className="input" {...register('vehicleId', { required: true })}>
            <option value="">Veículo</option>
            {vehicles?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.placa} - {v.modelo}
              </option>
            ))}
          </select>
          <select className="input" {...register('serviceId')}>
            <option value="">Serviço (opcional)</option>
            {services?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
          <input className="input" type="datetime-local" {...register('dataHoraInicio', { required: true })} />
          <input className="input" type="datetime-local" {...register('dataHoraFim', { required: true })} />
          <select className="input" {...register('status')}>
            <option value="">Status (padrão: AGENDADO)</option>
            <option value="CONFIRMADO">CONFIRMADO</option>
            <option value="EM_ANDAMENTO">EM_ANDAMENTO</option>
            <option value="CONCLUIDO">CONCLUIDO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
          <textarea className="input md:col-span-3 h-16" placeholder="Observações" {...register('observacoes')} />
          <div className="md:col-span-3 flex justify-end">
            <button className="btn btn-primary" type="submit">
              Salvar agendamento
            </button>
          </div>
        </form>
      </div>

      <div className="card p-4">
        {isLoading && <p>Carregando...</p>}
        {!isLoading && (
          <div className="grid md:grid-cols-2 gap-3">
            {data?.map((ag) => (
              <div key={ag.id} className="border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-emerald-400">{ag.client?.nomeCompleto ?? 'Cliente'}</h4>
                  <span className="text-xs px-2 py-1 rounded bg-slate-800">{ag.status}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Veículo: {ag.vehicle?.placa} | Serviço: {ag.service?.nome ?? '-'}
                </p>
                <p className="text-xs text-slate-500">
                  Início: {new Date(ag.dataHoraInicio).toLocaleString()} <br />
                  Fim: {new Date(ag.dataHoraFim).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
