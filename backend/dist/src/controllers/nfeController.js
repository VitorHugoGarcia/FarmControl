"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerNotaFiscal = void 0;
const xml2js_1 = __importDefault(require("xml2js"));
const fs_1 = __importDefault(require("fs"));
const lerNotaFiscal = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ sucesso: false, erro: 'Por favor, envie um arquivo XML.' });
        }
        const xmlTexto = fs_1.default.readFileSync(req.file.path, 'utf-8');
        const parser = new xml2js_1.default.Parser({ explicitArray: false, mergeAttrs: true });
        const resultado = await parser.parseStringPromise(xmlTexto);
        fs_1.default.unlinkSync(req.file.path);
        if (!resultado.nfeProc || !resultado.nfeProc.NFe) {
            return res.status(400).json({ sucesso: false, erro: 'Este arquivo não parece ser um XML de NF-e válido.' });
        }
        const infoNota = resultado.nfeProc.NFe.infNFe;
        // --- TRATAMENTO DA LISTA DE PRODUTOS ---
        // Se a nota tiver só 1 item, o xml2js cria um objeto. Se tiver vários, cria um Array.
        // Esse truque do .flat() garante que "itens" SEMPRE seja um Array para o .map funcionar.
        const itensRaw = [infoNota.det].flat();
        const listaMedicamentos = itensRaw.map((item) => {
            const produto = item.prod;
            return {
                itemNumero: item.nItem,
                nome: produto.xProd,
                codigoBarras: produto.cEAN,
                ncm: produto.NCM,
                quantidade: parseFloat(produto.qCom),
                valorUnitario: parseFloat(produto.vUnCom),
                valorTotalItem: parseFloat(produto.vProd),
                // Se houver a tag <med> específica de medicamentos, pegamos os dados dela
                dadosMedicos: produto.med ? {
                    codigoAnvisa: produto.med.cProdANVISA,
                    precoMaximoConsumidor: parseFloat(produto.med.vPMC)
                } : null
            };
        });
        // ----------------------------------------
        const dadosMastigados = {
            chaveAcesso: infoNota.Id.replace('NFe', ''),
            numeroNota: infoNota.ide.nNF,
            dataEmissao: infoNota.ide.dhEmi,
            fornecedor: {
                nome: infoNota.emit.xNome,
                cnpj: infoNota.emit.CNPJ,
            },
            medicamentos: listaMedicamentos, // <-- Injetando a lista aqui
            valorTotal: parseFloat(infoNota.total.ICMSTot.vNF)
        };
        return res.json({
            sucesso: true,
            mensagem: 'NF-e e medicamentos lidos com sucesso!',
            dados: dadosMastigados
        });
    }
    catch (erro) {
        console.error('Erro ao ler XML:', erro);
        if (req.file && fs_1.default.existsSync(req.file.path)) {
            fs_1.default.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            sucesso: false,
            erro: 'Falha interna ao processar o XML.',
            detalheDoErro: erro.message || erro
        });
    }
};
exports.lerNotaFiscal = lerNotaFiscal;
//# sourceMappingURL=nfeController.js.map