import path from "path";
import { create } from "xmlbuilder2";
import fs from "fs";
import PDFDocument from "pdfkit";

interface itemCompra {
    id: number;
    nome: string;
    fabricante: string;
    quantidade: number;
    preco: number;
}

export const gerarXMLCompra = (itens: itemCompra[], nomeArquivo: string): string => {
  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const documento = create({ version: "1.0", encoding: "UTF-8" })
    .ele("notaCompra")
      .ele("dataEmissao").txt(new Date().toISOString()).up()
      .ele("itens");

  itens.forEach((item) => {
    documento
      .ele("item")
        .ele("id").txt(String(item.id)).up()
        .ele("nome").txt(item.nome).up()
        .ele("fabricante").txt(item.fabricante).up()
        .ele("quantidade").txt(String(item.quantidade)).up()
        .ele("precoUnitario").txt(item.preco.toFixed(2)).up()
        .ele("subtotal").txt((item.preco * item.quantidade).toFixed(2)).up()
      .up();
  });

  const xml = documento.up()
    .ele("total").txt(total.toFixed(2)).up()
  .end({ prettyPrint: true });

  const filePath = path.join(__dirname, "../notas", `${nomeArquivo}.xml`);
  fs.writeFileSync(filePath, xml);

  return filePath;
};

export const gerarPDFCompra = (itens: itemCompra[], nomeArquivo: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "../notas", `${nomeArquivo}.pdf`);
    const documento = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    documento.pipe(stream);

    documento.fontSize(20).text("FarmControl", { align: "center" });
    documento.fontSize(14).text("Nota de Compra", { align: "center" });
    documento.moveDown();
    documento.fontSize(10).text(`Data: ${new Date().toLocaleString("pt-BR")}`);
    documento.moveDown();

    documento.fontSize(12).text("Itens da compra:");
    documento.moveDown(0.5);

    itens.forEach((item, index) => {
      documento.fontSize(10).text(
        `${index + 1}. ${item.nome} | Qtd: ${item.quantidade} | Preço unit.: R$ ${item.preco.toFixed(2)} | Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}`
      );
    });

    const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    documento.moveDown();
    documento.fontSize(12).text(`Total: R$ ${total.toFixed(2)}`, { align: "right" });

    documento.end();
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};