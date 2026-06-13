import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarMedicamento, importarNotaFiscal } from "../services/medicamento.service";

interface ItemXml {
    nome: string;
    fabricante: string;
    lote: string;
    categoria: string;
    quantidade: number;
    precoCompra: number;
    dataValidade: string;
    precoVenda: string;
}

function parseXml(texto: string): ItemXml[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(texto, "application/xml");
    const fabricante = doc.querySelector("emit > xNome")?.textContent || "";
    const dets = Array.from(doc.querySelectorAll("det"));

    return dets.map((det) => ({
        nome:         det.querySelector("xProd")?.textContent || "",
        fabricante,
        lote:         det.querySelector("lote")?.textContent || "",
        categoria:    det.querySelector("categoria")?.textContent || "",
        quantidade:   Math.floor(Number(det.querySelector("qCom")?.textContent || "0")),
        precoCompra:  Number(det.querySelector("vUnCom")?.textContent || "0"),
        dataValidade: det.querySelector("dataValidade")?.textContent || "",
        precoVenda:   "",
    }));
}

export default function CadastroManualPage() {
    const navigate = useNavigate();
    const [aba, setAba] = useState<"manual" | "xml">("manual");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [enviando, setEnviando] = useState(false);

    const [form, setForm] = useState({
        nome: "", categoria: "", fabricante: "", lote: "",
        codigoBarras: "", quantidade: "", precoCompra: "", precoVenda: "", dataValidade: "",
    });

    const [arquivo, setArquivo] = useState<File | null>(null);
    const [itensXml, setItensXml] = useState<ItemXml[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setArquivo(file);
        setItensXml([]);
        setErro("");

        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const itens = parseXml(ev.target?.result as string);
                    if (itens.length === 0) throw new Error("Nenhum item encontrado no XML.");
                    setItensXml(itens);
                } catch {
                    setErro("Erro ao ler o XML. Verifique o formato do arquivo.");
                }
            };
            reader.readAsText(file);
        }
    };

    const handlePrecoVendaChange = (index: number, valor: string) => {
        setItensXml((prev) => prev.map((item, i) => i === index ? { ...item, precoVenda: valor } : item));
    };

    const handleSubmitManual = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setEnviando(true);
        try {
            await criarMedicamento({
                nome: form.nome, categoria: form.categoria, fabricante: form.fabricante,
                lote: form.lote, codigoBarras: form.codigoBarras,
                quantidade: Number(form.quantidade), quantidadeMinima: 10,
                precoCompra: Number(form.precoCompra), precoVenda: Number(form.precoVenda),
                dataValidade: form.dataValidade,
            });
            navigate("/");
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao cadastrar medicamento");
        } finally {
            setEnviando(false);
        }
    };

    const handleSubmitXml = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setSucesso("");

        if (!arquivo || itensXml.length === 0) {
            setErro("Selecione um arquivo XML válido.");
            return;
        }

        const precosInvalidos = itensXml.some((i) => !i.precoVenda || Number(i.precoVenda) <= 0);
        if (precosInvalidos) {
            setErro("Preencha o preço de venda de todos os medicamentos.");
            return;
        }

        setEnviando(true);
        try {
            const precos = itensXml.map((i) => Number(i.precoVenda));
            const resultado = await importarNotaFiscal(arquivo, precos);
            setSucesso(`${resultado.length} medicamento(s) cadastrado(s) com sucesso!`);
            setArquivo(null);
            setItensXml([]);
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao importar XML");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl">
            <h1 className="text-2xl font-bold mb-4">Cadastro de Medicamento</h1>

            <div className="flex mb-6 border-b border-gray-300">
                <button onClick={() => { setAba("manual"); setErro(""); setSucesso(""); }}
                    className={`px-4 py-2 font-medium text-sm ${aba === "manual" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                    Cadastro Manual
                </button>
                <button onClick={() => { setAba("xml"); setErro(""); setSucesso(""); }}
                    className={`px-4 py-2 font-medium text-sm ${aba === "xml" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                    Importar XML
                </button>
            </div>

            {erro && <p className="text-red-500 mb-4 text-sm">{erro}</p>}
            {sucesso && <p className="text-green-600 mb-4 text-sm">{sucesso}</p>}

            {aba === "manual" && (
                <form onSubmit={handleSubmitManual} className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg border border-gray-300">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Nome</label>
                        <input name="nome" value={form.nome} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Categoria</label>
                        <input name="categoria" value={form.categoria} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Fabricante</label>
                        <input name="fabricante" value={form.fabricante} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Lote</label>
                        <input name="lote" value={form.lote} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Código de Barras</label>
                        <input name="codigoBarras" value={form.codigoBarras} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Data de Validade</label>
                        <input type="date" name="dataValidade" value={form.dataValidade} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantidade</label>
                        <input type="number" name="quantidade" value={form.quantidade} onChange={handleChange} required min="0" className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Preço de Compra</label>
                        <input type="number" name="precoCompra" value={form.precoCompra} onChange={handleChange} required min="0" step="0.01" className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Preço de Venda</label>
                        <input type="number" name="precoVenda" value={form.precoVenda} onChange={handleChange} required min="0" step="0.01" className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div className="col-span-2">
                        <button type="submit" disabled={enviando} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {enviando ? "Cadastrando..." : "Cadastrar"}
                        </button>
                    </div>
                </form>
            )}

            {aba === "xml" && (
                <form onSubmit={handleSubmitXml} className="bg-white p-6 rounded-lg border border-gray-300">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Arquivo XML da Nota Fiscal</label>
                        <input
                            type="file" accept=".xml"
                            onChange={handleArquivoChange}
                            className="w-full border border-gray-300 rounded-md p-2 bg-white"
                        />
                    </div>

                    {itensXml.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                                {itensXml.length} medicamento(s) encontrado(s) — defina o preço de venda de cada um:
                            </p>
                            <div className="overflow-auto rounded-md border border-gray-200">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-600">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-medium">Medicamento</th>
                                            <th className="px-3 py-2 text-left font-medium">Lote</th>
                                            <th className="px-3 py-2 text-left font-medium">Qtd</th>
                                            <th className="px-3 py-2 text-left font-medium">Preço Compra</th>
                                            <th className="px-3 py-2 text-left font-medium">Validade</th>
                                            <th className="px-3 py-2 text-left font-medium">Preço Venda (R$)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itensXml.map((item, i) => (
                                            <tr key={i} className="border-t border-gray-200">
                                                <td className="px-3 py-2">{item.nome}</td>
                                                <td className="px-3 py-2">{item.lote}</td>
                                                <td className="px-3 py-2">{item.quantidade}</td>
                                                <td className="px-3 py-2">R$ {item.precoCompra.toFixed(2)}</td>
                                                <td className="px-3 py-2">{item.dataValidade}</td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        min="0.01"
                                                        step="0.01"
                                                        value={item.precoVenda}
                                                        onChange={(e) => handlePrecoVendaChange(i, e.target.value)}
                                                        className="w-24 border border-gray-300 rounded-md p-1 text-sm"
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={enviando || itensXml.length === 0}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {enviando ? "Importando..." : "Importar XML"}
                    </button>
                </form>
            )}
        </div>
    );
}
