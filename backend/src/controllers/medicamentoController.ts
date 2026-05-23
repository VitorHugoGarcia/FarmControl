import { Request, Response } from "express";
import { prisma } from "../prisma";
import xml2js from "xml2js";

export const processarNotaFiscal = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "Nenhum arquivo XML enviado" });
    return;
  }

  const { lote, categoria, dataValidade, quantidadeMinima } = req.body;

  if (!lote || !categoria || !dataValidade || !quantidadeMinima) {
    res.status(400).json({ error: "Campos obrigatórios: lote, categoria, dataValidade, quantidadeMinima" });
    return;
  }

  const xmlString = req.file.buffer.toString("utf-8");
  const parsed = await xml2js.parseStringPromise(xmlString, { explicitArray: false });

  const nfe = parsed.nfeProc.NFe.infNFe;
  const fabricante = nfe.emit.xNome;
  const itens = Array.isArray(nfe.det) ? nfe.det : [nfe.det];

  const medicamentos = await Promise.all(
    itens.map((item: any) => {
      const prod = item.prod;
      return prisma.medicamento.create({
        data: {
          nome: prod.xProd,
          fabricante,
          quantidade: Math.floor(Number(prod.qCom)),
          preco: Number(prod.vUnCom),
          lote,
          categoria,
          dataValidade: new Date(dataValidade),
          quantidadeMinima: Number(quantidadeMinima),
        },
      });
    })
  );

  res.status(201).json(medicamentos);
};

export const listarMedicamentos = async (req: Request, res: Response) => {
  const medicamentos = await prisma.medicamento.findMany();
  res.json(medicamentos);
};

export const buscarMedicamento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const medicamento = await prisma.medicamento.findUnique({
    where: { id: Number(id) },
  });

  if (!medicamento) {
    res.status(404).json({ error: "Medicamento não encontrado" });
    return;
  }

  res.json(medicamento);
};

export const atualizarMedicamento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, categoria, fabricante, lote, quantidade, quantidadeMinima, preco, dataValidade } = req.body;
  const medicamento = await prisma.medicamento.update({
    where: { id: Number(id) },
    data: { nome, categoria, fabricante, lote, quantidade, quantidadeMinima, preco, dataValidade: new Date(dataValidade) },
  });
  res.json(medicamento);
};

export const deletarMedicamento = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.medicamento.delete({
    where: { id: Number(id) },
  });
  res.status(204).send();
};