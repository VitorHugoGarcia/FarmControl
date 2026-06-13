import { useState, useEffect } from "react";
import { listarMedicamentos, realizarVenda, obterLinkDownload } from "../services/medicamento.service";
import type { Medicamento } from "../types/Medicamento";

export default function VendaPage() {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [selectedMedId, setSelectedMedId] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [arquivos, setArquivos] = useState<{ xml: string } | null>(null);

    const carregarLista = () => {
        listarMedicamentos()
            .then(setMedicamentos)
            .catch(() => setErro("Erro ao carregar a lista de medicamentos."));
    };

    useEffect(() => {
        carregarLista();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setSucesso("");
        setArquivos(null);
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
            setArquivos(response.arquivos);
            setSelectedMedId("");
            setQuantidade("");
            carregarLista();

        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao realizar a venda.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Realizar Venda</h1>

            {erro && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-md border border-red-300">{erro}</div>}
            {sucesso && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-md border border-green-300">{sucesso}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm mb-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Selecione o Medicamento</label>
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
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Quantidade</label>
                    <input
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

            {arquivos && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 text-center">
                    <h2 className="text-lg font-bold mb-4 text-gray-700">Nota Fiscal Gerada</h2>
                    <p className="text-sm text-gray-600 mb-4">Baixe o documento referente a esta venda:</p>
                    
                    <a href={obterLinkDownload(arquivos.xml)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium">
                        Baixar XML
                    </a>
                </div>
            )}
        </div>
    );
}