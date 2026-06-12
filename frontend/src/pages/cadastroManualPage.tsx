import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarMedicamento, importarNotaFiscal } from "../services/medicamento.service";

export default function CadastroManualPage() {
    const navigate = useNavigate();
    const [aba, setAba] = useState<"manual" | "xml">("manual");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [enviando, setEnviando] = useState(false);

   const [form, setForm] = useState({
        nome: "",
        categoria: "",
        fabricante: "",
        lote: "",
        quantidade: "",
        precoCompra: "",
        precoVenda: "",
        dataValidade: "",
    });

    const [arquivo, setArquivo] = useState<File | null>(null);
    const [precoVendaXml, setPrecoVendaXml] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmitManual = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setEnviando(true);

        try {
            await criarMedicamento({
                nome: form.nome,
                categoria: form.categoria,
                fabricante: form.fabricante,
                lote: form.lote,
                quantidade: Number(form.quantidade),
                quantidadeMinima: 10,
                precoCompra: Number(form.precoCompra),
                precoVenda: Number(form.precoVenda),
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
        setEnviando(true);

        if (!arquivo) {
            setErro("Selecione um arquivo XML.");
            setEnviando(false);
            return;
        }

        try {
            const resultado = await importarNotaFiscal(arquivo, Number(precoVendaXml));
            setSucesso(`${resultado.length} medicamento(s) cadastrado(s) com sucesso!`);
            setArquivo(null);
            setPrecoVendaXml("");
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao importar XML");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Cadastro de Medicamento</h1>

            <div className="flex mb-6 border-b border-gray-300">
                <button
                    onClick={() => { setAba("manual"); setErro(""); setSucesso(""); }}
                    className={`px-4 py-2 font-medium text-sm ${aba === "manual" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                    Cadastro Manual
                </button>
                <button
                    onClick={() => { setAba("xml"); setErro(""); setSucesso(""); }}
                    className={`px-4 py-2 font-medium text-sm ${aba === "xml" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                    Importar XML
                </button>
            </div>

            {erro && <p className="text-red-500 mb-4">{erro}</p>}
            {sucesso && <p className="text-green-600 mb-4">{sucesso}</p>}

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
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Arquivo XML da Nota Fiscal</label>
                        <input
                            type="file"
                            accept=".xml"
                            onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                            required
                            className="w-full border border-gray-300 rounded-md p-2 bg-white"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Preço de Venda (R$)</label>
                        <input
                            type="number"
                            value={precoVendaXml}
                            onChange={(e) => setPrecoVendaXml(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                            placeholder="Ex: 25.90"
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <button type="submit" disabled={enviando} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {enviando ? "Importando..." : "Importar XML"}
                    </button>
                </form>
            )}
        </div>
    );
}