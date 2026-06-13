import path from "path";
import { create } from "xmlbuilder2";
import fs from "fs";

interface itemVenda {
    nome: string;
    fabricante: string;
    quantidade: number;
    precoVenda: number;
}

export const gerarXMLVenda = (itens: itemVenda[], nomeArquivo: string): string => {
    const total = itens.reduce((acc, item) => acc + item.precoVenda * item.quantidade, 0);
    const agora = new Date().toISOString();
    const nNF = Date.now().toString().slice(-6);

     const doc = create({ version: "1.0", encoding: "UTF-8" })
        .ele("nfeProc", { xmlns: "http://www.portalfiscal.inf.br/nfe", versao: "4.00" })
        .ele("NFe")
            .ele("infNFe", { Id: `NFe_saida_${nNF}`, versao: "4.00" })
            .ele("ide")
                .ele("nNF").txt(nNF).up()
                .ele("dhEmi").txt(agora).up()
                .ele("tpNF").txt("1").up()
            .up()
            .ele("emit")
                .ele("CNPJ").txt("00000000000000").up()
                .ele("xNome").txt("FARMCONTROL FARMÁCIA LTDA").up()
            .up();

    itens.forEach((item, index) => {
        doc
        .ele("det", { nItem: String(index + 1) })
            .ele("prod")
            .ele("xProd").txt(item.nome).up()
            .ele("qCom").txt(item.quantidade.toFixed(4)).up()
            .ele("vUnCom").txt(item.precoVenda.toFixed(4)).up()
            .ele("vProd").txt((item.precoVenda * item.quantidade).toFixed(2)).up()
            .up()
        .up();
    });

    doc
        .ele("total")
        .ele("ICMSTot")
            .ele("vNF").txt(total.toFixed(2)).up()
        .up()
        .up();

    const xml = doc.end({ prettyPrint: true });

    const notasDir = path.join(process.cwd(), "src/notas");
  if (!fs.existsSync(notasDir)) {
    fs.mkdirSync(notasDir, { recursive: true });
  }

  const filePath = path.join(process.cwd(), "src/notas", `${nomeArquivo}.xml`);
  fs.writeFileSync(filePath, xml);

  return filePath;
}