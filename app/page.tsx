export default function Home() {
  return (
    <div className="space-y-8">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Painel Rápido</h1>
        <p className="text-slate-500">Selecione um serviço para iniciar o atendimento</p>
      </div>

      {/* Seção: Serviços de Moto */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          🏍️ Serviços de Moto
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card: Lavagem Simples */}
          <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border-t-4 border-t-blue-500">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Lavagem Simples</h3>
              <p className="text-3xl font-black text-blue-600 my-3">R$ 25</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li className="flex gap-2"><span>✓</span> Água + Shampoo Neutro</li>
                <li className="flex gap-2"><span>✓</span> Limpeza básica e secagem</li>
                <li className="flex gap-2"><span>⏱️</span> Rápida (20–30 min)</li>
              </ul>
            </div>
            <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 rounded-lg transition-colors">
              Abrir OS
            </button>
          </div>

          {/* Card: Lavagem Completa */}
          <div className="bg-white p-6 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border-t-4 border-t-yellow-500 relative">
            <span className="absolute -top-3 right-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Mais Pedida 🏆
            </span>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Lavagem Completa</h3>
              <p className="text-3xl font-black text-yellow-600 my-3">R$ 35</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li className="flex gap-2"><span>✓</span> Lavagem detalhada</li>
                <li className="flex gap-2"><span>✓</span> Rodas caprichadas</li>
                <li className="flex gap-2"><span>⭐</span> Melhor custo-benefício</li>
              </ul>
            </div>
            <button className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-bold py-3 rounded-lg transition-colors">
              Abrir OS
            </button>
          </div>

          {/* Card: Lavagem Premium */}
          <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border-t-4 border-t-red-600">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Lavagem Premium</h3>
              <p className="text-3xl font-black text-red-600 my-3">R$ 50</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li className="flex gap-2"><span>✓</span> Limpeza técnica detalhada</li>
                <li className="flex gap-2"><span>✓</span> Aplicação de cera e proteção</li>
                <li className="flex gap-2"><span>✨</span> Acabamento Top + Pneus</li>
              </ul>
            </div>
            <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold py-3 rounded-lg transition-colors">
              Abrir OS
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}