import { useState, useEffect, useRef } from "react";
import { listarMedicamentos, realizarVenda, obterLinkDownload, buscarPorCodigoBarras } from "../services/medicamento.service";
import type { Medicamento } from "../types/Medicamento";

export default function VendaPage() {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [selectedMedId, setSelectedMedId] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [codigoBarras, setCodigoBarras] = useState("");
    const [erroBarcode, setErroBarcode] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [xmlFilename, setXmlFilename] = useState<string | null>(null);
    const barcodeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        listarMedicamentos()
            .then(setMedicamentos)
            .catch(() => setErro("Erro ao carregar a lista de medicamentos."));
    }, []);

    const handleBarcodeSearch = async () => {
        if (!codigoBarras.trim()) return;
        setErroBarcode("");
        try {
            const med = await buscarPorCodigoBarras(codigoBarras.trim());
            setSelectedMedId(String(med.id));
            setCodigoBarras("");
            // foca no campo de quantidade
            document.getElementById("campo-quantidade")?.focus();
        } catch (e) {
            setErroBarcode(e instanceof Error ? e.message : "Não encontrado.");
            setCodigoBarras("");
        }
    };

    const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleBarcodeSearch();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setSucesso("");
        setXmlFilename(null);
        setLoading(true);

        if (!selectedMedId || Number(quantidade) <= 0) {
            setErro("Selecione um medicamento e informe uma quantidade válida.");
            setLoading(false);
            return;
        }

        try {
            const response = await realizarVenda([{
                id: Number(selectedMedId),
                quantidade: Number(quantidade)
            }]);

            setSucesso(response.message || "Venda realizada com sucesso!");
            setXmlFilename(response.arquivos.xml);
            setSelectedMedId("");
            setQuantidade("");
            barcodeRef.current?.focus();
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao realizar a venda.");
        } finally {
            setLoading(false);
        }
    };

    const medSelecionado = medicamentos.find((m) => String(m.id) === selectedMedId);

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Realizar Venda</h1>

            {erro && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-md border border-red-300">{erro}</div>}
            {sucesso && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-md border border-green-300">{sucesso}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm mb-6">

                {/* Campo de código de barras */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                        Código de Barras
                    </label>
                    <div className="flex gap-2">
                        <input
                            ref={barcodeRef}
                            type="text"
                            value={codigoBarras}
                            onChange={(e) => { setCodigoBarras(e.target.value); setErroBarcode(""); }}
                            onKeyDown={handleBarcodeKeyDown}
                            className="flex-1 border border-gray-300 rounded-md p-2"
                            placeholder="Escaneie ou digite o código e pressione Enter"
                        />
                        <button
                            type="button"
                            onClick={handleBarcodeSearch}
                            className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 text-sm"
                        >
                            Buscar
                        </button>
                    </div>
                    {erroBarcode && <p className="text-red-500 text-xs mt-1">{erroBarcode}</p>}
                </div>

                {/* Seleção manual */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Medicamento</label>
                    <select
                        value={selectedMedId}
                        onChange={(e) => setSelectedMedId(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md p-2 bg-white"
                    >
                        <option value="" disabled>-- Escolha um medicamento --</option>
                        {medicamentos.map((med) => (
                            <option key={med.id} value={med.id} disabled={med.quantidade <= 0}>
                                {med.nome} (Estoque: {med.quantidade}) - R$ {Number(med.precoVenda).toFixed(2)}
                            </option>
                        ))}
                    </select>
                    {medSelecionado && (
                        <p className="text-xs text-gray-500 mt-1">
                            Validade: {new Date(medSelecionado.dataValidade).toLocaleDateString("pt-BR")} · Lote: {medSelecionado.lote}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Quantidade</label>
                    <input
                        id="campo-quantidade"
                        type="number"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        required
                        min="1"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Ex: 2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? "A processar..." : "Confirmar Venda"}
                </button>
            </form>

            {xmlFilename && (
                <div className="flex justify-center">
                    <a
                        href={obterLinkDownload(xmlFilename)}
                        download={xmlFilename}
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
                    >
                        Download XML
                    </a>
                </div>
            )}
        </div>
    );
}
