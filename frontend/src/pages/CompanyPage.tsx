import { useEffect, useState } from 'react';
import api from '../lib/api';

export function CompanyPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/companies/me')
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!data?.id) return;
    setMessage(null);
    await api.patch(`/companies/${data.id}`, {
      nomeFantasia: data.nomeFantasia,
      telefone: data.telefone,
      whatsapp: data.whatsapp,
      email: data.email,
    });
    setMessage('Salvo com sucesso');
  };

  if (loading) return <p>Carregando...</p>;
  if (!data) return <p>Empresa não encontrada para este usuário.</p>;

  return (
    <div className="card p-4 space-y-4 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold">Empresa</h2>
        <p className="text-sm text-slate-400">Editar dados básicos (nome, contato)</p>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-200">Nome Fantasia</label>
          <input
            className="input mt-1"
            value={data.nomeFantasia ?? ''}
            onChange={(e) => setData({ ...data, nomeFantasia: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-200">Telefone</label>
            <input
              className="input mt-1"
              value={data.telefone ?? ''}
              onChange={(e) => setData({ ...data, telefone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-slate-200">WhatsApp</label>
            <input
              className="input mt-1"
              value={data.whatsapp ?? ''}
              onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-200">Email</label>
          <input className="input mt-1" value={data.email ?? ''} onChange={(e) => setData({ ...data, email: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <button className="btn btn-primary" onClick={save}>
          Salvar
        </button>
        {message && <span className="text-sm text-emerald-400">{message}</span>}
      </div>
    </div>
  );
}
