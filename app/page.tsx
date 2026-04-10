"use client";

import { useState } from "react";

export default function Home() {
  // Estado para controlar qual serviço foi selecionado. Se for null, o modal fica fechado.
  const [servicoSelecionado, setServicoSelecionado] = useState<{nome: string, preco: number} | null>(null);

  const fecharModal = () => setServicoSelecionado(null);

  return (
    <div className="space-y-8 relative">
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
            <button 
              onClick={() => setServicoSelecionado({ nome: "Lavagem Simples (Moto)", preco: 25 })}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 rounded-lg transition-colors"
            >
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
            <button 
              onClick={() => setServicoSelecionado({ nome: "Lavagem Completa (Moto)", preco: 35 })}
              className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-bold py-3 rounded-lg transition-colors"
            >
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
            <button 
              onClick={() => setServicoSelecionado({ nome: "Lavagem Premium (Moto)", preco: 50 })}
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold py-3 rounded-lg transition-colors"
            >
              Abrir OS
            </button>
          </div>

        </div>
      </section>

      {/* OVERLAY E MODAL DE NOVA OS */}
      {servicoSelecionado && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          
          {/* Caixa do Modal */}
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Nova Ordem de Serviço</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Serviço: <span className="text-red-600 font-bold">{servicoSelecionado.nome}</span> - R$ {servicoSelecionado.preco}
                </p>
              </div>
              <button onClick={fecharModal} className="text-slate-400 hover:text-slate-700 p-1">
                ✕
              </button>
            </div>

            <form 
              className="space-y-4" 
              onSubmit={(e) => { 
                e.preventDefault(); 
                alert(`OS de ${servicoSelecionado.nome} registrada com sucesso!`); 
                fecharModal(); 
              }}
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Placa do Veículo *</label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-lg p-3 uppercase font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="ABC-1234"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="Ex: João da Silva"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp (Opcional)</label>
                <input
                  type="tel"
                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
                >
                  Confirmar OS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}