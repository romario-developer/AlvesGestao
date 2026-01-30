import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useClients } from '../hooks/useClients';
import { useVehicles } from '../hooks/useVehicles';
import api from '../lib/api';

type VehicleForm = {
  clientId: string;
  placa: string;
  tipo: string;
  marca: string;
  modelo: string;
  ano?: number;
  cor?: string;
};

export function VehiclesPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, refetch } = useVehicles(search);
  const { data: clients } = useClients('');
  const { register, handleSubmit, reset } = useForm<VehicleForm>();

  const onSubmit = async (values: VehicleForm) => {
    await api.post('/vehicles', {
      ...values,
      ano: values.ano ? Number(values.ano) : undefined,
    });
    reset();
    refetch();
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Veículos</h2>
          <p className="text-slate-400 text-sm">Cadastro rápido vinculado ao cliente</p>
        </div>
        <input className="input w-full md:w-64" placeholder="Buscar placa/modelo" value={search} onChange={(e) => setSearch(e.target.value)} />
      </header>

      <div className="card p-4 space-y-3">
        <h3 className="font-semibold text-emerald-400">Novo Veículo</h3>
        <form className="grid md:grid-cols-6 gap-3" onSubmit={handleSubmit(onSubmit)}>
          <select className="input" {...register('clientId', { required: true })}>
            <option value="">Selecione o cliente</option>
            {clients?.map((client) => (
              <option key={client.id} value={client.id}>
                {client.nomeCompleto}
              </option>
            ))}
          </select>
          <input className="input" placeholder="Placa" {...register('placa', { required: true })} />
          <input className="input" placeholder="Tipo (carro/moto)" {...register('tipo', { required: true })} />
          <input className="input" placeholder="Marca" {...register('marca', { required: true })} />
          <input className="input" placeholder="Modelo" {...register('modelo', { required: true })} />
          <input className="input" placeholder="Ano" type="number" {...register('ano', { valueAsNumber: true })} />
          <input className="input" placeholder="Cor" {...register('cor')} />
          <div className="md:col-span-6 flex justify-end">
            <button className="btn btn-primary" type="submit">
              Salvar
            </button>
          </div>
        </form>
      </div>

      <div className="card p-4">
        {isLoading && <p>Carregando...</p>}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data?.map((v) => (
              <div key={v.id} className="border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-emerald-400">{v.placa}</h4>
                  <span className="text-xs text-slate-400">{v.tipo}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {v.marca} {v.modelo} {v.ano ?? ''}
                </p>
                <p className="text-xs text-slate-400">Cliente: {v.client?.nomeCompleto ?? '-'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
