import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useClients } from '../hooks/useClients';
import api from '../lib/api';
import { VehicleCreateModal } from '../components/VehicleCreateModal';
import { ClientEditModal } from '../components/ClientEditModal';

type ClientForm = {
  nomeCompleto: string;
  whatsapp?: string;
  email?: string;
  tags?: string;
};

type SelectedClient = { id: string; nomeCompleto: string };
type ClientItem = SelectedClient & {
  whatsapp?: string;
  email?: string;
  tags?: string[];
};

export function ClientsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, refetch } = useClients(search);
  const { register, handleSubmit, reset } = useForm<ClientForm>();
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);

  const onSubmit = async (values: ClientForm) => {
    await api.post('/clients', {
      nomeCompleto: values.nomeCompleto,
      whatsapp: values.whatsapp,
      email: values.email,
      tags: values.tags ? values.tags.split(',').map((t) => t.trim()) : [],
    });
    reset();
    refetch();
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Clientes</h2>
          <p className="text-slate-400 text-sm">Cadastro e listagem (search)</p>
        </div>
        <input
          className="input w-full md:w-64"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>
      {successMessage && <p className="text-xs text-emerald-400">{successMessage}</p>}

      <div className="card p-4 space-y-3">
        <h3 className="font-semibold text-emerald-400">Novo Cliente</h3>
        <form className="grid md:grid-cols-4 gap-3" onSubmit={handleSubmit(onSubmit)}>
          <input className="input" placeholder="Nome completo" {...register('nomeCompleto', { required: true })} />
          <input className="input" placeholder="WhatsApp" {...register('whatsapp')} />
          <input className="input" placeholder="Email" {...register('email')} />
          <input className="input" placeholder="Tags separadas por vírgula" {...register('tags')} />
          <div className="md:col-span-4 flex justify-end">
            <button className="btn btn-primary" type="submit">
              Salvar
            </button>
          </div>
        </form>
      </div>

      <div className="card p-4">
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data?.map((client) => (
              <div key={client.id} className="border border-slate-800 rounded-lg p-3 space-y-2">
                <h4 className="font-semibold text-emerald-400">{client.nomeCompleto}</h4>
                <p className="text-xs text-slate-400">WhatsApp: {client.whatsapp ?? '-'}</p>
                <p className="text-xs text-slate-400">Email: {client.email ?? '-'}</p>
                <p className="text-xs text-slate-400">Tags: {(client.tags ?? []).join(', ') || '-'}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="btn btn-ghost text-xs"
                    onClick={() => setSelectedClient({ id: client.id, nomeCompleto: client.nomeCompleto })}
                  >
                    Adicionar veículo
                  </button>
                  <button
                    className="btn btn-ghost text-xs"
                    onClick={() =>
                      setEditingClient({
                        id: client.id,
                        nomeCompleto: client.nomeCompleto,
                        whatsapp: client.whatsapp,
                        email: client.email,
                        tags: client.tags,
                      })
                    }
                  >
                    Editar
                  </button>
                  <button className="btn btn-ghost text-xs" disabled title="Backend não expõe DELETE /clients">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <VehicleCreateModal
        open={!!selectedClient}
        clientId={selectedClient?.id ?? ''}
        clientName={selectedClient?.nomeCompleto}
        onClose={() => setSelectedClient(null)}
        onSuccess={() => {
          setSuccessMessage('Veículo cadastrado com sucesso!');
          setTimeout(() => setSuccessMessage(null), 3000);
          setSelectedClient(null);
        }}
      />
      <ClientEditModal
        open={!!editingClient}
        client={editingClient}
        onClose={() => setEditingClient(null)}
        onSuccess={() => {
          setSuccessMessage('Cliente atualizado com sucesso!');
          setTimeout(() => setSuccessMessage(null), 3000);
        }}
      />
    </div>
  );
}
