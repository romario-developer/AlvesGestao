import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// No Next.js 15+, params é uma Promise, então precisamos declarar assim:
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Aguardamos (await) o Next.js extrair o ID da URL
    const { id } = await params;
    
    const data = await request.json();
    
    const osAtualizada = await prisma.ordemServico.update({
      where: { id: id },
      data: { status: data.status },
    });

    return NextResponse.json(osAtualizada);
  } catch (error) {
    console.error("Erro na API de atualização:", error);
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
  }
}