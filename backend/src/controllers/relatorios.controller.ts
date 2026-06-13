import { Request, Response } from "express";
import { prisma } from "../prisma";

export const relatorioValidade = async (_req: Request, res: Response) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const em7Dias = new Date(hoje);
  em7Dias.setDate(em7Dias.getDate() + 7);

  const em30Dias = new Date(hoje);
  em30Dias.setDate(em30Dias.getDate() + 30);

  const todos = await prisma.medicamento.findMany({
    orderBy: { dataValidade: "asc" },
  });

  const vencidos = todos.filter((m) => new Date(m.dataValidade) < hoje);

  const sete_dias = todos.filter((m) => {
    const d = new Date(m.dataValidade);
    return d >= hoje && d <= em7Dias;
  });

  const trinta_dias = todos.filter((m) => {
    const d = new Date(m.dataValidade);
    return d > em7Dias && d <= em30Dias;
  });

  res.json({ vencidos, sete_dias, trinta_dias });
};

export const relatorioEstoque = async (_req: Request, res: Response) => {
  const todos = await prisma.medicamento.findMany({
    orderBy: { quantidade: "asc" },
  });

  const zerados = todos.filter((m) => m.quantidade === 0);
  const abaixo_minimo = todos.filter(
    (m) => m.quantidade > 0 && m.quantidade <= m.quantidadeMinima
  );

  res.json({ zerados, abaixo_minimo });
};

function calcularPeriodo(vendas: { quantidade: number; precoVenda: number; precoCompra: number }[]) {
  const receita = vendas.reduce((s, v) => s + v.quantidade * v.precoVenda, 0);
  const custo   = vendas.reduce((s, v) => s + v.quantidade * v.precoCompra, 0);
  return { receita, custo };
}

export const relatorioLucros = async (_req: Request, res: Response) => {
  const agora = new Date();

  const inicioDia = new Date(agora);
  inicioDia.setHours(0, 0, 0, 0);

  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  const inicioAno = new Date(agora.getFullYear(), 0, 1);

  const [vendasDia, vendasMes, vendasAno, vencidos] = await Promise.all([
    prisma.venda.findMany({ where: { createdAt: { gte: inicioDia } } }),
    prisma.venda.findMany({ where: { createdAt: { gte: inicioMes } } }),
    prisma.venda.findMany({ where: { createdAt: { gte: inicioAno } } }),
    prisma.medicamento.findMany({ where: { dataValidade: { lt: agora }, quantidade: { gt: 0 } } }),
  ]);

  const perda = vencidos.reduce((s, m) => s + m.quantidade * Number(m.precoCompra), 0);

  const dia = calcularPeriodo(vendasDia);
  const mes = calcularPeriodo(vendasMes);
  const ano = calcularPeriodo(vendasAno);

  res.json({
    dia: {
      receita: dia.receita,
      custo: dia.custo,
      perda,
      lucro: dia.receita - dia.custo - perda,
    },
    mes: {
      receita: mes.receita,
      custo: mes.custo,
      perda,
      lucro: mes.receita - mes.custo - perda,
    },
    ano: {
      receita: ano.receita,
      custo: ano.custo,
      perda,
      lucro: ano.receita - ano.custo - perda,
    },
  });
};
