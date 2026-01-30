import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/auth-store';

const navItems = [
  { to: '/', label: 'Dashboard', exact: true },
  { to: '/company', label: 'Empresa' },
  { to: '/clients', label: 'Clientes' },
  { to: '/vehicles', label: 'Veículos' },
  { to: '/services', label: 'Serviços' },
  { to: '/packages', label: 'Pacotes' },
  { to: '/appointments', label: 'Agenda' },
  { to: '/work-orders', label: 'OS/Vendas' },
];

export function ShellLayout() {
  const logout = useAuthStore((s) => s.logout);
  const userName = useAuthStore((s) => s.userName);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="p-4 border-b border-slate-800">
          <Link to="/" className="text-lg font-bold text-emerald-400">
            Alves Gestão
          </Link>
          <p className="text-xs text-slate-400">Multi-empresa</p>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-100 hover:bg-slate-800'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 text-xs text-slate-400 border-t border-slate-800">
          <p>Logado: {userName ?? 'Usuário'}</p>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="mt-2 text-emerald-400 hover:text-emerald-300"
          >
            Sair
          </button>
        </div>
      </aside>
      <main className="flex-1">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <p className="text-sm text-slate-400">Alves Lava a Jato</p>
            <h1 className="text-2xl font-semibold">Painel Operacional</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300">Suporte: WhatsApp</span>
            <a
              href="https://wa.me/5500000000000?text=Suporte%20Alves%20Gestao"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Abrir WhatsApp
            </a>
          </div>
        </header>
        <div className="p-6 space-y-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
