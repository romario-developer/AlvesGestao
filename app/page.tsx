"use client";

import { useState } from "react";

export default function Home() {
  const [servicoSelecionado, setServicoSelecionado] = useState<{nome: string, preco: number} | null>(null);

  const fecharModal = () => setServicoSelecionado(null);

  return (
    <div className="space-y-12 relative">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">Painel de Atendimento</h1>
        <p className="text-slate-500">Escolha o serviço para gerar a Ordem de Serviço</p>
      </div>

      {/* SEÇÃO: MOTOS */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-4 border-red-600 pl-3">
          🏍️ Serviços de Moto
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Lavagem Simples Moto */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-t-blue-500">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Simples (Moto)</h3>
              <p className="text-3xl font-black text-slate-900 my-3 font-mono">R$ 25</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Shampoo Neutro</li>
                <li>• Secagem rápida</li>
              </ul>
            </div>
            <button 
              onClick={() => setServicoSelecionado({ nome: "Simples (Moto)", preco: 25 })}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Abrir OS
            </button>
          </div>

          {/* Card: Lavagem Completa Moto */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-t-yellow-500 relative">
             <span className="absolute -top-3 right-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full uppercase">Top 🏆</span>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Completa (Moto)</h3>
              <p className="text-3xl font-black text-slate-900 my-3 font-mono">R$ 35</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Detalhada (Carenagem + Motor)</li>
                <li>• Acabamento refinado</li>
              </ul>
            </div>
            <button 
              onClick={() => setServicoSelecionado({ nome: "Completa (Moto)", preco: 35 })}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Abrir OS
            </button>
          </div>

          {/* Card: Lavagem Premium Moto */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-t-red-600">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Premium (Moto)</h3>
              <p className="text-3xl font-black text-slate-900 my-3 font-mono">R$ 50</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Cera de brilho e proteção</li>
                <li>• Pretinho nos pneus</li>
              </ul>
            </div>
            <button 
              onClick={() => setServicoSelecionado({ nome: "Premium (Moto)", preco: 50 })}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Abrir OS
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO: CARROS */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-4 border-blue-600 pl-3">
          🚗 Serviços de Carro
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Lavagem Simples Carro */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-t-blue-500">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Simples (Carro)</h3>
              <p className="text-3xl font-black text-slate-900 my-3 font-mono">R$ 40</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Exterior + Aspiração</li>
                <li>• Pretinho básico</li>
              </ul>
            </div>
            <button 
              onClick={() => setServicoSelecionado({ nome: "Simples (Carro)", preco: 40 })}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Abrir OS
            </button>
          </div>

          {/* Card: Lavagem Completa Carro */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-t-yellow-500">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Completa (Carro)</h3>
              <p className="text-3xl font-black text-slate-900 my-3 font-mono">R$ 60</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Limpeza de painel e vidros</li>
                <li>• Cera líquida rápida</li>
              </ul>
            </div>
            <button 
              onClick={() => setServicoSelecionado({ nome: "Completa (Carro)", preco: 60 })}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Abrir OS
            </button>
          </div>

          {/* Card: Lavagem Premium Carro */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-t-red-600">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Premium (Carro)</h3>
              <p className="text-3xl font-black text-slate-900 my-3 font-mono">R$ 100</p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Cera em pasta cristalizadora</li>
                <li>• Higienização interna</li>
              </ul>
            </div>
            <button 
              onClick={() => setServicoSelecionado({ nome: "Premium (Carro)", preco: 100 })}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Abrir OS
            </button>
          </div>
        </div>
      </section>

      {/* MODAL DE NOVA OS (Mantido igual, mas com estilização ajustada) */}
      {servicoSelecionado && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border-t-8 border-red-600 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase">Confirmar Entrada</h2>
                <div className="mt-2 inline-block bg-slate-100 px-3 py-1 rounded text-sm">
                  <span className="font-bold text-slate-700">{servicoSelecionado.nome}</span>
                  <span className="ml-2 text-red-600 font-black">R$ {servicoSelecionado.preco}</span>
                </div>
              </div>
              <button onClick={fecharModal} className="text-slate-400 hover:text-slate-900 text-2xl">✕</button>
            </div>

            <form 
              className="space-y-5" 
              onSubmit={(e) => { 
                e.preventDefault(); 
                alert(`OS de ${servicoSelecionado.nome} registrada no sistema!`); 
                fecharModal(); 
              }}
            >
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-1">Placa</label>
                <input
                  type="text"
                  className="w-full border-2 border-slate-200 rounded-xl p-4 uppercase font-bold text-xl focus:border-red-600 outline-none transition-all"
                  placeholder="BRA2E19"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-1">Dono(a) do Veículo</label>
                <input
                  type="text"
                  className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-red-600 outline-none transition-all"
                  placeholder="Nome do cliente"
                  required
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 px-4 py-4 border-2 border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/40 uppercase"
                >
                  Gerar OS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}