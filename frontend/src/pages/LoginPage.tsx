import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../lib/auth-store';

export function LoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login-simple', { email, password });
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        companyId: data.user.companyId ?? data.company?.id ?? null,
        userName: data.user.nome,
      });
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao logar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-400">Alves Gestão</h1>
          <p className="text-slate-400 text-sm">Login da empresa</p>
          {import.meta.env.DEV && (
            <p className="text-xs text-emerald-300">Alves Gestão — build DEV (porta 5174)</p>
          )}
        </div>
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="text-sm text-slate-200">E-mail</label>
            <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-slate-200">Senha</label>
            <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button disabled={loading} className="btn btn-primary w-full" type="submit">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <p className="text-sm text-center text-slate-400">
            <Link to="/register" className="text-emerald-400">
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
