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