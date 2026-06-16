import path from "path";
import { create } from "xmlbuilder2";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, "../../uploads");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

export interface ItemVenda {
  id: number;
  nome: string;
  fabricante: string;
  quantidade: number;
  preco: number;
  total: number;
}

export function gerarXML(itens: ItemVenda[], totalGeral: number, timestamp: number): string {
  const filename = `venda_${timestamp}.xml`;
  const filepath = path.join(OUTPUT_DIR, filename);

  const root = create({ version: "1.0", encoding: "UTF-8" }).ele("venda");
  root.ele("data").txt(new Date().toISOString());
  const itensEl = root.ele("itens");

  for (const item of itens) {
    itensEl
      .ele("item")
      .ele("nome").txt(item.nome).up()
      .ele("fabricante").txt(item.fabricante).up()
      .ele("quantidade").txt(String(item.quantidade)).up()
      .ele("precoUnitario").txt(item.preco.toFixed(2)).up()
      .ele("subtotal").txt(item.total.toFixed(2)).up();
  }

  root.ele("total").txt(totalGeral.toFixed(2));

  const xml = root.end({ prettyPrint: true });
  fs.writeFileSync(filepath, xml, "utf-8");
  return filename;
}