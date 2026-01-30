import { useForm, useFieldArray } from 'react-hook-form';
import { useClients } from '../hooks/useClients';
import { useVehicles } from '../hooks/useVehicles';
import { useServices } from '../hooks/useServices';
import { useWorkOrders } from '../hooks/useWorkOrders';
import api from '../lib/api';

type WorkOrderForm = {
  clientId: string;
  vehicleId: string;
  formaRecebimento?: string;
  items: { serviceId: string; precoUnitario: number; quantidade?: number; desconto?: number; acrescimo?: number }[];
  payments?: { metodo: string; valor: number }[];
};

export function WorkOrdersPage() {
  const { data: workOrders, isLoading, refetch } = useWorkOrders();
  const { data: clients } = useClients('');
  const { data: vehicles } = useVehicles('');
  const { data: services } = useServices('');

  const { register, control, handleSubmit, reset } = useForm<WorkOrderForm>({
    defaultValues: {
      items: [{ serviceId: '', precoUnitario: 0, quantidade: 1 }],
      payments: [{ metodo: 'PIX', valor: 0 }],
    },
  });

  const itemsArray = useFieldArray({ control, name: 'items' });
  const paymentsArray = useFieldArray({ control, name: 'payments' });

  const onSubmit = async (values: WorkOrderForm) => {
    await api.post('/work-orders', {
      ...values,
      items: values.items.map((i) => ({
        ...i,
        precoUnitario: Number(i.precoUnitario),
        quantidade: i.quantidade ? Number(i.quantidade) : 1,
        desconto: i.desconto ? Number(i.desconto) : 0,
        acrescimo: i.acrescimo ? Number(i.acrescimo) : 0,
      })),
      payments: values.payments?.map((p) => ({
        ...p,
        valor: Number(p.valor),
      })),
    });
    reset({
      items: [{ serviceId: '', precoUnitario: 0, quantidade: 1 }],
      payments: [{ metodo: 'PIX', valor: 0 }],
    });
    refetch();
  };

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold">OS / Vendas</h2>
        <p className="text-slate-400 text-sm">Criação rápida de OS com itens e pagamentos</p>
      </header>

      <div className="card p-4 space-y-3">
        <h3 className="font-semibold text-emerald-400">Nova OS</h3>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-3 gap-3">
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
            <input className="input" placeholder="Forma de recebimento (texto livre)" {...register('formaRecebimento')} />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-300">Itens</p>
            {itemsArray.fields.map((field, index) => (
              <div key={field.id} className="grid md:grid-cols-5 gap-2 items-center">
                <select className="input" {...register(`items.${index}.serviceId` as const, { required: true })}>
                  <option value="">Serviço</option>
                  {services?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome}
                    </option>
                  ))}
                </select>
                <input className="input" type="number" step="0.01" placeholder="Preço" {...register(`items.${index}.precoUnitario` as const, { valueAsNumber: true })} />
                <input className="input" type="number" placeholder="Qtd" {...register(`items.${index}.quantidade` as const, { valueAsNumber: true })} />
                <input className="input" type="number" step="0.01" placeholder="Desc" {...register(`items.${index}.desconto` as const, { valueAsNumber: true })} />
                <input className="input" type="number" step="0.01" placeholder="Acresc" {...register(`items.${index}.acrescimo` as const, { valueAsNumber: true })} />
              </div>
            ))}
            <button type="button" className="btn btn-ghost" onClick={() => itemsArray.append({ serviceId: '', precoUnitario: 0, quantidade: 1 })}>
              + Item
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-300">Pagamentos</p>
            {paymentsArray.fields.map((field, index) => (
              <div key={field.id} className="grid md:grid-cols-3 gap-2 items-center">
                <select className="input" {...register(`payments.${index}.metodo` as const, { required: true })}>
                  <option value="PIX">PIX</option>
                  <option value="DEBITO">Débito</option>
                  <option value="CREDITO">Crédito</option>
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="BOLETO">Boleto/Outros</option>
                </select>
                <input className="input" type="number" step="0.01" placeholder="Valor" {...register(`payments.${index}.valor` as const, { valueAsNumber: true })} />
                <button type="button" className="btn btn-ghost" onClick={() => paymentsArray.remove(index)}>
                  Remover
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-ghost" onClick={() => paymentsArray.append({ metodo: 'PIX', valor: 0 })}>
              + Pagamento
            </button>
          </div>

          <div className="flex justify-end">
            <button className="btn btn-primary" type="submit">
              Salvar OS
            </button>
          </div>
        </form>
      </div>

      <div className="card p-4">
        {isLoading && <p>Carregando...</p>}
        {!isLoading && (
          <div className="space-y-3">
            {workOrders?.map((os) => (
              <div key={os.id} className="border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">OS #{os.numeroSequencial}</p>
                    <h4 className="font-semibold text-emerald-400">{os.client?.nomeCompleto ?? 'Cliente'}</h4>
                    <p className="text-xs text-slate-400">Veículo: {os.vehicle?.placa}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-slate-800">{os.status}</span>
                </div>
                <div className="mt-2 text-xs text-slate-300">
                  {os.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.quantidade}x {item.service?.nome}
                      </span>
                      <span>R$ {Number(item.precoUnitario).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-slate-200">
                  Total líquido: <span className="text-emerald-400">R$ {Number(os.totalLiquido).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
