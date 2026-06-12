import { Request, Response } from "express";
import { prisma } from "../prisma";

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

      if (novaQuantidade === 0) {
        return prisma.medicamento.delete({ where: { id: item.id } });
      } else {
        return prisma.medicamento.update({
          where: { id: item.id },
          data: { quantidade: novaQuantidade },
        });
      }
    })
  );

  res.status(201).json({ message: "Venda realizada com sucesso" });
};