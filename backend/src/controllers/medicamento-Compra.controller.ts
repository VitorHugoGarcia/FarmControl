import { Request, Response } from "express";
import { prisma } from "../prisma";
import { gerarPDFCompra, gerarXMLCompra } from "../services/notaFiscal.service";
import path from "path";

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
    
    return prisma.medicamento.update({
      where: { id: item.id },
      data: { quantidade: med.quantidade - item.quantidade },
    });
  })
);

  const itensNota = itens.map((item, i) => {
  const med = medicamentos[i];

  if (!med) throw new Error(`Medicamento com id ${item.id} não encontrado`);
  
  return {
    id: med.id,
    nome: med.nome,
    fabricante: med.fabricante,
    quantidade: item.quantidade,
    preco: med.precoVenda,
  };
});

  const nomeArquivo = `compra_${Date.now()}`;
  const xmlPath = gerarXMLCompra(itensNota, nomeArquivo);
  const pdfPath = await gerarPDFCompra(itensNota, nomeArquivo);

  res.status(201).json({
    message: "Compra realizada com sucesso",
    arquivos: {
      xml: path.basename(xmlPath),
      pdf: path.basename(pdfPath),
    },
  });
};

export const downloadArquivo = (req: Request<{ arquivo: string }>, res: Response) => {
  const { arquivo } = req.params;

  if (!arquivo) {
    res.status(400).json({ error: "Nome do arquivo não informado" });
    return;
  }

  const filePath = path.join(__dirname, "../notas", arquivo);
  res.download(filePath);
};