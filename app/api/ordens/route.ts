import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Importa a conexão que criamos

// AVISA AO NEXT.JS PARA NÃO FAZER CACHE DESTA ROTA
export const dynamic = 'force-dynamic';

// BUSCAR TODAS AS ORDENS (Quando carregar a página)
export async function GET() {
  try {
    const ordens = await prisma.ordemServico.findMany({
      orderBy: { createdAt: 'desc' } // Traz as mais recentes primeiro
    });
    return NextResponse.json(ordens);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar ordens" }, { status: 500 });
  }
}

// CRIAR UMA NOVA ORDEM (Quando o botão "Gerar OS" for clicado)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const novaOS = await prisma.ordemServico.create({
      data: {
        placa: data.placa,
        cliente: data.cliente,
        servico: data.servico,
        preco: data.preco,
        status: "fila"
      }
    });

    return NextResponse.json(novaOS, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar OS" }, { status: 500 });
  }
}