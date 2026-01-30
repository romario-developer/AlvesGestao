import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useServices } from '../hooks/useServices';
import api from '../lib/api';

type ServiceForm = {
  nome: string;
  descricao?: string;
  categoria?: string;
  duracaoMinutos?: number;
  precoBase: number;
  geraPosVenda?: boolean;
  diasFollowUp?: number;
};

export function ServicesPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, refetch } = useServices(search);
  const { register, handleSubmit, reset } = useForm<ServiceForm>();

  const onSubmit = async (values: ServiceForm) => {
    await api.post('/services', {
      ...values,
      duracaoMinutos: values.duracaoMinutos ? Number(values.duracaoMinutos) : undefined,
      precoBase: Number(values.precoBase),
      diasFollowUp: values.diasFollowUp ? Number(values.diasFollowUp) : undefined,
    });
    reset();
    refetch();
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Serviços</h2>
          <p className="text-slate-400 text-sm">CRUD simples com flag de pós-venda</p>
        </div>
        <input className="input w-full md:w-64" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </header>

      <div className="card p-4 space-y-3">
        <h3 className="font-semibold text-emerald-400">Novo Serviço</h3>
        <form className="grid md:grid-cols-6 gap-3" onSubmit={handleSubmit(onSubmit)}>
          <input className="input" placeholder="Nome" {...register('nome', { required: true })} />
          <input className="input" placeholder="Categoria" {...register('categoria')} />
          <input className="input" placeholder="Duração (min)" type="number" {...register('duracaoMinutos', { valueAsNumber: true })} />
          <input className="input" placeholder="Preço base" type="number" step="0.01" {...register('precoBase', { required: true, valueAsNumber: true })} />
          <label className="flex items-center gap-2 text-sm text-slate-200 mt-2">
            <input type="checkbox" {...register('geraPosVenda')} /> Gera pós-venda
          </label>
          <input className="input" placeholder="Dias follow-up" type="number" {...register('diasFollowUp', { valueAsNumber: true })} />
          <textarea className="input md:col-span-6 h-20" placeholder="Descrição" {...register('descricao')} />
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
            {data?.map((srv) => (
              <div key={srv.id} className="border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-emerald-400">{srv.nome}</h4>
                  {srv.geraPosVenda && <span className="text-xs text-amber-400">Pós {srv.diasFollowUp}d</span>}
                </div>
                <p className="text-xs text-slate-400">{srv.descricao ?? 'Sem descrição'}</p>
                <p className="text-xs text-slate-400">Preço base: R$ {Number(srv.precoBase).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
