import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../lib/auth-store';

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const companyResponse = await api.post('/companies', { nomeFantasia: companyName });
      const company = companyResponse.data;
      await api.post('/auth/register', {
        companyId: company.id,
        nome: name,
        email,
        password,
        role: 'OWNER',
      });

      const loginResponse = await api.post('/auth/login-simple', { email, password });
      const loginData = loginResponse.data;
      setAuth({
        accessToken: loginData.accessToken,
        refreshToken: loginData.refreshToken,
        companyId: loginData.user.companyId ?? loginData.company?.id ?? null,
        userName: loginData.user.nome,
      });
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-400">Criar conta</h1>
          <p className="text-slate-400 text-sm">Registre sua empresa e o usuário administrador</p>
        </div>
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="text-sm text-slate-200">Empresa (nome fantasia)</label>
            <input
              className="input mt-1"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-200">Nome do administrador</label>
            <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-slate-200">E-mail</label>
            <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-slate-200">Senha</label>
            <input
              className="input mt-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button disabled={loading} className="btn btn-primary w-full" type="submit">
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
          <p className="text-sm text-center text-slate-400">
            Já tem conta?{' '}
            <Link to="/login" className="text-emerald-400">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
