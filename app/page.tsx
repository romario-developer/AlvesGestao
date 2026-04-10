"use client";

import { useState } from "react";

// Definindo os tipos para organizar nossos dados
type StatusOS = 'fila' | 'lavando' | 'finalizado';

type OrdemServico = {
  id: number;
  placa: string;
  cliente: string;
  servico: string;
  preco: number;
  status: StatusOS;
};

export default function Home() {
  // Controle de Abas
  const [abaAtiva, setAbaAtiva] = useState<'novo' | 'patio'>('novo');

  // Estados do Modal
  const [servicoSelecionado, setServicoSelecionado] = useState<{nome: string, preco: number} | null>(null);
  const [placaInput, setPlacaInput] = useState("");
  const [clienteInput, setClienteInput] = useState("");

  // Estado das Ordens de Serviço (Nosso "banco de dados" provisório)
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);

  const fecharModal = () => {
    setServicoSelecionado(null);
    setPlacaInput("");
    setClienteInput("");
  };

  // Função para salvar a OS e mandar pro Kanban
  const gerarOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicoSelecionado) return;

    const novaOS: OrdemServico = {
      id: Date.now(),
      placa: placaInput.toUpperCase(),
      cliente: clienteInput,
      servico: servicoSelecionado.nome,
      preco: servicoSelecionado.preco,
      status: 'fila',
    };

    setOrdens([...ordens, novaOS]);
    fecharModal();
    setAbaAtiva('patio'); // Redireciona automaticamente para o pátio
  };

  // Função para mover o card no Kanban
  const alterarStatus = (id: number, novoStatus: StatusOS) => {
    setOrdens(ordens.map(os => os.id === id ? { ...os, status: novoStatus } : os));
  };

  // Integração com WhatsApp
  const avisarCliente = (cliente: string, placa: string) => {
    const mensagem = `Olá, ${cliente}! Sua máquina (Placa: ${placa}) já está com o melhor brilho da cidade e pronta para retirada no Alves Lava-Rápido! 🚀✨`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Navegação por Abas */}
      <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner max-w-sm mx-auto mb-8">
        <button 
          onClick={() => setAbaAtiva('novo')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${abaAtiva === 'novo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          ➕ Novo Serviço
        </button>
        <button 
          onClick={() => setAbaAtiva('patio')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${abaAtiva === 'patio' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          📋 Pátio ({ordens.length})
        </button>
      </div>

      {/* ABA 1: NOVO SERVIÇO (Os cards que já tínhamos) */}
      {abaAtiva === 'novo' && (
        <div className="space-y-12 animate-in fade-in duration-300">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">Catálogo de Serviços</h1>
            <p className="text-slate-500">Escolha o serviço para gerar a Ordem de Serviço</p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-4 border-red-600 pl-3">
              🏍️ Serviços de Moto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card Simples Moto */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-t-blue-500">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Simples (Moto)</h3>
                  <p className="text-3xl font-black text-slate-900 my-3 font-mono">R$ 25</p>
                  <ul className="text-sm text-slate-600 space-y-2 mb-6">
                    <li>• Shampoo Neutro</li>
                    <li>• Secagem rápida</li>
                  </ul>
                </div>
                <button onClick={() => setServicoSelecionado({ nome: "Simples (Moto)", preco: 25 })} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">Abrir OS</button>
              </div>

              {/* Card Completa Moto */}
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
                <button onClick={() => setServicoSelecionado({ nome: "Completa (Moto)", preco: 35 })} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">Abrir OS</button>
              </div>

              {/* Card Premium Moto */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-t-red-600">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Premium (Moto)</h3>
                  <p className="text-3xl font-black text-slate-900 my-3 font-mono">R$ 50</p>
                  <ul className="text-sm text-slate-600 space-y-2 mb-6">
                    <li>• Cera de brilho e proteção</li>
                    <li>• Pretinho nos pneus</li>
                  </ul>
                </div>
                <button onClick={() => setServicoSelecionado({ nome: "Premium (Moto)", preco: 50 })} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">Abrir OS</button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-4 border-blue-600 pl-3">
              🚗 Serviços de Carro
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card Simples Carro */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-t-blue-500">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Simples (Carro)</h3>
                  <p className="text-3xl font-black text-slate-900 my-3 font-mono">R$ 40</p>
                  <ul className="text-sm text-slate-600 space-y-2 mb-6">
                    <li>• Exterior + Aspiração</li>
                    <li>• Pretinho básico</li>
                  </ul>
                </div>
                <button onClick={() => setServicoSelecionado({ nome: "Simples (Carro)", preco: 40 })} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">Abrir OS</button>
              </div>

              {/* Card Completa Carro */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-t-yellow-500">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Completa (Carro)</h3>
                  <p className="text-3xl font-black text-slate-900 my-3 font-mono">R$ 60</p>
                  <ul className="text-sm text-slate-600 space-y-2 mb-6">
                    <li>• Limpeza de painel e vidros</li>
                    <li>• Cera líquida rápida</li>
                  </ul>
                </div>
                <button onClick={() => setServicoSelecionado({ nome: "Completa (Carro)", preco: 60 })} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">Abrir OS</button>
              </div>

              {/* Card Premium Carro */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-t-4 border-t-red-600">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Premium (Carro)</h3>
                  <p className="text-3xl font-black text-slate-900 my-3 font-mono">R$ 100</p>
                  <ul className="text-sm text-slate-600 space-y-2 mb-6">
                    <li>• Cera em pasta</li>
                    <li>• Higienização interna</li>
                  </ul>
                </div>
                <button onClick={() => setServicoSelecionado({ nome: "Premium (Carro)", preco: 100 })} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">Abrir OS</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ABA 2: QUADRO KANBAN (PÁTIO) */}
      {abaAtiva === 'patio' && (
        <div className="animate-in fade-in duration-300">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">Controle de Pátio</h1>
            <p className="text-slate-500">Arraste os serviços ou use os botões para atualizar o status</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Coluna: Na Fila */}
            <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 min-h-[500px]">
              <h3 className="font-black text-slate-700 mb-4 flex items-center gap-2 uppercase text-sm tracking-wider">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span> Na Fila
              </h3>
              <div className="space-y-4">
                {ordens.filter(os => os.status === 'fila').map(os => (
                  <div key={os.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase">{os.servico}</p>
                    <h4 className="text-xl font-black text-slate-900 my-1">{os.placa}</h4>
                    <p className="text-sm text-slate-600 mb-4">👤 {os.cliente}</p>
                    <button 
                      onClick={() => alterarStatus(os.id, 'lavando')}
                      className="w-full bg-blue-50 text-blue-700 font-bold py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      Iniciar Lavagem ➔
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna: Lavando */}
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 min-h-[500px]">
              <h3 className="font-black text-blue-800 mb-4 flex items-center gap-2 uppercase text-sm tracking-wider">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span> Lavando
              </h3>
              <div className="space-y-4">
                {ordens.filter(os => os.status === 'lavando').map(os => (
                  <div key={os.id} className="bg-white p-4 rounded-xl shadow-sm border border-blue-200">
                    <p className="text-xs font-bold text-blue-400 uppercase">{os.servico}</p>
                    <h4 className="text-xl font-black text-slate-900 my-1">{os.placa}</h4>
                    <p className="text-sm text-slate-600 mb-4">👤 {os.cliente}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => alterarStatus(os.id, 'fila')}
                        className="px-3 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm"
                      >
                        ←
                      </button>
                      <button 
                        onClick={() => alterarStatus(os.id, 'finalizado')}
                        className="flex-1 bg-green-50 text-green-700 font-bold py-2 rounded-lg hover:bg-green-100 transition-colors text-sm"
                      >
                        Finalizar ✔️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna: Finalizado */}
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 min-h-[500px]">
              <h3 className="font-black text-green-800 mb-4 flex items-center gap-2 uppercase text-sm tracking-wider">
                <span className="w-3 h-3 rounded-full bg-green-500"></span> Finalizado
              </h3>
              <div className="space-y-4">
                {ordens.filter(os => os.status === 'finalizado').map(os => (
                  <div key={os.id} className="bg-white p-4 rounded-xl shadow-sm border border-green-200">
                    <p className="text-xs font-bold text-green-500 uppercase">{os.servico}</p>
                    <h4 className="text-xl font-black text-slate-900 my-1">{os.placa}</h4>
                    <p className="text-sm text-slate-600 mb-4">👤 {os.cliente}</p>
                    <button 
                      onClick={() => avisarCliente(os.cliente, os.placa)}
                      className="w-full bg-[#25D366] text-white font-bold py-2 rounded-lg hover:bg-[#1ebe5d] transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      📱 Avisar no WhatsApp
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE NOVA OS */}
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

            <form className="space-y-5" onSubmit={gerarOS}>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-1">Placa *</label>
                <input
                  type="text"
                  value={placaInput}
                  onChange={(e) => setPlacaInput(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl p-4 uppercase font-bold text-xl focus:border-red-600 outline-none transition-all"
                  placeholder="BRA2E19"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-1">Cliente *</label>
                <input
                  type="text"
                  value={clienteInput}
                  onChange={(e) => setClienteInput(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-red-600 outline-none transition-all"
                  placeholder="Nome do cliente"
                  required
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={fecharModal} className="flex-1 px-4 py-4 border-2 border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  Voltar
                </button>
                <button type="submit" className="flex-1 px-4 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/40 uppercase">
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