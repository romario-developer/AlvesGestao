export function SpacesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Espaços e vagas</h2>
        <p className="text-sm text-slate-400">Configuração e alocação de boxes para o dia a dia.</p>
      </header>

      <div className="card p-6 space-y-3">
        <p className="text-sm text-slate-400">
          Módulo ainda em construção: use o backend para gerenciar `Space` e `SpaceAllocation`. Aqui você poderá
          reservar vagas, validar área de atendimento e monitorar ocupação.
        </p>
        <p className="text-sm text-slate-400">Enquanto isso, use a agenda e as OS para coordenar manualmente.</p>
      </div>
    </div>
  );
}
