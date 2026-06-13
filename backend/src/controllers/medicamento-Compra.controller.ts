import { Request, Response } from "express";
import { prisma } from "../prisma";
import { gerarXML, type ItemVenda } from "../services/notaFiscal.service.js";

interface ItemCompraRequest {
  id: number;
  quantidade: number;
}

export const realizarCompra = async (req: Request, res: Response) => {
  const itens: ItemCompraRequest[] = req.body.itens;

  if (!itens || itens.length === 0) {
    res.status(400).json({ error: "Nenhum item informado" });
    return;
  }

  const medicamentos = await Promise.all(
    itens.map((item) =>
      prisma.medicamento.findUnique({ where: { id: item.id } })
    )
  );

  for (let i = 0; i < itens.length; i++) {
    const med = medicamentos[i];
    const item = itens[i];

    if (!med || !item) {
      res.status(404).json({ error: `Medicamento não encontrado` });
      return;
    }

    if (med.quantidade < item.quantidade) {
      res.status(400).json({
        error: `Estoque insuficiente para ${med.nome}. Disponível: ${med.quantidade}`,
      });
      return;
    }
  }

  await Promise.all(
    itens.map((item, i) => {
      const med = medicamentos[i];
      if (!med) throw new Error(`Medicamento com id ${item.id} não encontrado`);
      const novaQuantidade = med.quantidade - item.quantidade;

      return prisma.medicamento.update({
        where: { id: item.id },
        data: { quantidade: novaQuantidade },
      });
    })
  );

  // Montar itens para nota fiscal
  const itensVenda: ItemVenda[] = itens.map((item, i) => {
    const med = medicamentos[i]!;
    const preco = Number(med.precoVenda);
    return {
      id: med.id,
      nome: med.nome,
      fabricante: med.fabricante,
      quantidade: item.quantidade,
      preco,
      total: preco * item.quantidade,
    };
  });

  const totalGeral = itensVenda.reduce((sum, i) => sum + i.total, 0);
  const timestamp = Date.now();

  const xmlFilename = gerarXML(itensVenda, totalGeral, timestamp);

  // Registrar vendas para relatório de lucros (não bloqueia a resposta em caso de falha)
  prisma.venda.createMany({
    data: itens.map((item, i) => {
      const med = medicamentos[i]!;
      return {
        nome: med.nome,
        quantidade: item.quantidade,
        precoVenda: Number(med.precoVenda),
        precoCompra: Number(med.precoCompra),
      };
    }),
  }).catch(() => {});

  res.status(201).json({
    message: "Venda realizada com sucesso!",
    arquivos: { xml: xmlFilename },
  });
};
