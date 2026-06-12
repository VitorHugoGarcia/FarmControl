import { Request, Response } from "express";
import { prisma } from "../prisma";
import xml2js from "xml2js";

export const processarNotaFiscal = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "Nenhum arquivo XML enviado" });
    return;
  }

  const { precoVenda } = req.body;

  if (!precoVenda) {
    res.status(400).json({ error: "Campo obrigatório: precoVenda" });
    return;
  }

  const xmlString = req.file.buffer.toString("utf-8");
  const parsed = await xml2js.parseStringPromise(xmlString, { explicitArray: false });
  const nfe = parsed.nfeProc.NFe.infNFe;
  const fabricante = nfe.emit.xNome;
  const itens = Array.isArray(nfe.det) ? nfe.det : [nfe.det];

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const medicamentos = await Promise.all(
    itens.map((item: any) => {
      const prod = item.prod;

      const dataValidade = new Date(prod.dataValidade);
      dataValidade.setHours(0, 0, 0, 0);

      if (dataValidade <= hoje) {
        throw new Error(`Medicamento "${prod.xProd}" está vencido ou vence hoje e não pode ser cadastrado.`);
      }

      return prisma.medicamento.create({
        data: {
          nome: prod.xProd,
          fabricante,
          quantidade: Math.floor(Number(prod.qCom)),
          precoCompra: Number(prod.vUnCom),
          precoVenda: Number(precoVenda),
          lote: prod.lote,
          categoria: prod.categoria,
          dataValidade,
          quantidadeMinima: 10,
        },
      });
    })
  );

  res.status(201).json(medicamentos);
};

export const criarMedicamento = async (req: Request, res: Response) => {
  const { nome, categoria, fabricante, lote, quantidade, quantidadeMinima, precoCompra, precoVenda, dataValidade } = req.body;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataVal = new Date(dataValidade);
  dataVal.setHours(0, 0, 0, 0);

  if (dataVal <= hoje) {
    res.status(400).json({ error: "Medicamento vencido ou que vence hoje não pode ser cadastrado." });
    return;
  }

  const medicamento = await prisma.medicamento.create({
    data: { nome, categoria, fabricante, lote, quantidade, quantidadeMinima, precoCompra, precoVenda, dataValidade: dataVal },
  });

  res.status(201).json(medicamento);
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
  const { nome, categoria, fabricante, lote, quantidade, quantidadeMinima, precoCompra, precoVenda, dataValidade } = req.body;

  const medicamento = await prisma.medicamento.update({
    where: { id: Number(id) },
    data: { nome, categoria, fabricante, lote, quantidade, quantidadeMinima, precoCompra, precoVenda, dataValidade: new Date(dataValidade) },
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