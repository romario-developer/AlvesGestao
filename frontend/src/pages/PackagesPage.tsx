import { useForm, useFieldArray } from 'react-hook-form';
import { useServices } from '../hooks/useServices';
import { usePackages } from '../hooks/usePackages';
import api from '../lib/api';

type PackageForm = {
  nome: string;
  descricao?: string;
  precoBase: number;
  items: { serviceId: string; quantidade?: number }[];
};

export function PackagesPage() {
  const { data: services } = useServices('');
  const { data: packages, isLoading, refetch } = usePackages();
  const { register, control, handleSubmit, reset } = useForm<PackageForm>({
    defaultValues: { items: [{ serviceId: '', quantidade: 1 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const onSubmit = async (values: PackageForm) => {
    await api.post('/service-packages', {
      ...values,
      precoBase: Number(values.precoBase),
      items: values.items.map((i) => ({ ...i, quantidade: i.quantidade ? Number(i.quantidade) : 1 })),
    });
    reset({ items: [{ serviceId: '', quantidade: 1 }] });
    refetch();
  };

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold">Pacotes de Serviço</h2>
        <p className="text-slate-400 text-sm">Combina serviços com preço especial</p>
      </header>

      <div className="card p-4 space-y-3">
        <h3 className="font-semibold text-emerald-400">Novo Pacote</h3>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-3 gap-3">
            <input className="input" placeholder="Nome" {...register('nome', { required: true })} />
            <input className="input" placeholder="Preço do pacote" type="number" step="0.01" {...register('precoBase', { required: true })} />
            <input className="input" placeholder="Descrição" {...register('descricao')} />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-300">Items</p>
            {fields.map((field, index) => (
              <div key={field.id} className="grid md:grid-cols-3 gap-2 items-center">
                <select className="input" {...register(`items.${index}.serviceId` as const, { required: true })}>
                  <option value="">Selecione um serviço</option>
                  {services?.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.nome}
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  placeholder="Qtd"
                  type="number"
                  defaultValue={field.quantidade}
                  {...register(`items.${index}.quantidade` as const, { valueAsNumber: true })}
                />
                <button type="button" className="btn btn-ghost" onClick={() => remove(index)}>
                  Remover
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-ghost" onClick={() => append({ serviceId: '', quantidade: 1 })}>
              + Adicionar serviço
            </button>
          </div>
          <div className="flex justify-end">
            <button className="btn btn-primary" type="submit">
              Salvar Pacote
            </button>
          </div>
        </form>
      </div>

      <div className="card p-4">
        {isLoading && <p>Carregando...</p>}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {packages?.map((pkg) => (
              <div key={pkg.id} className="border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-emerald-400">{pkg.nome}</h4>
                  <span className="text-xs text-slate-400">R$ {Number(pkg.precoBase).toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-400">{pkg.descricao ?? '-'}</p>
                <div className="text-xs text-slate-300 mt-1">
                  {(pkg.items ?? []).map((it: any) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.quantidade}x {it.service?.nome}</span>
                      <span>{it.service?.categoria ?? ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
