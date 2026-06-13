import { useState, useEffect } from "react";
import { listarMedicamentos, deletarMedicamento } from "../services/medicamento.service";
import type { Medicamento } from "../types/Medicamento";

export default function HomePage() {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [erroDeletar, setErroDeletar] = useState("");
    const [deletandoId, setDeletandoId] = useState<number | null>(null);
    const [confirmandoId, setConfirmandoId] = useState<number | null>(null);

    useEffect(() => {
        listarMedicamentos()
        .then(setMedicamentos)
        .catch(() => setErro("Erro ao carregar medicamentos"))
        .finally(() => setLoading(false));
    }, []);

    const handleDeletar = async (id: number) => {
        setErroDeletar("");
        setDeletandoId(id);
        try {
            await deletarMedicamento(id);
            setMedicamentos((prev) => prev.filter((m) => m.id !== id));
        } catch (e) {
            setErroDeletar(e instanceof Error ? e.message : "Erro ao excluir.");
        } finally {
            setDeletandoId(null);
            setConfirmandoId(null);
        }
    };

    if (loading) return <p className="p-4">Carregando...</p>;
    if (erro) return <p className="p-4 text-red-500">{erro}</p>;

    const medicamentosCriticos = medicamentos.filter(med => med.quantidade <= med.quantidadeMinima);

    const HOJE = new Date();
    const medicamentosValidadeCritica = medicamentos.filter((med) => {
        const dataValidade = new Date(med.dataValidade);
        const diferencaTempo = dataValidade.getTime() - HOJE.getTime();
        const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
        return diferencaDias <= 30;
    });

    return (
        <div className="p-6 font-sans">
            <div className="flex flex-wrap gap-6">
                {medicamentosCriticos.length > 0 && (
                    <div className="mb-6 items-center gap-3 p-7 bg-red-50 border-2 border-gray-200 rounded-xl text-sm w-60 h-40" role="alert">
                        <div className="mb-3"><h1>Estoque Mínimo</h1></div>
                        <div className="text-3xl text-red-600 mb-3">{medicamentosCriticos.length}</div>
                        <div className="text-red-600">Atenção!</div>
                    </div>
                )}
                {medicamentosValidadeCritica.length > 0 && (
                    <div className="mb-6 items-center gap-3 p-7 bg-red-50 border-2 border-gray-200 rounded-xl text-sm w-60 h-40" role="alert">
                        <div className="mb-3"><h1>Vencimento Próximo</h1></div>
                        <div className="text-3xl text-violet-600 mb-3">{medicamentosValidadeCritica.length}</div>
                        <div className="text-violet-600">Atenção!</div>
                    </div>
                )}
            </div>

            {erroDeletar && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                    {erroDeletar}
                </div>
            )}

            <h1 className="text-2xl font-bold mb-4 pl-3">Estoque de Medicamentos</h1>
            <div className="overflow-auto rounded-lg">
                <table className="w-full border-collapse border-2 border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Produto</th>
                            <th className="p-2">Categoria</th>
                            <th className="p-2">Fabricante</th>
                            <th className="p-2">Lote</th>
                            <th className="p-2">Estoque</th>
                            <th className="p-2">Validade</th>
                            <th className="p-2">Preço</th>
                            <th className="p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicamentos.map((med) => (
                            <tr
                                key={med.id}
                                className={
                                    medicamentosCriticos.includes(med) ? "bg-red-100" :
                                    medicamentosValidadeCritica.includes(med) ? "bg-violet-200" : ""
                                }
                            >
                                <td className="border-t border-gray-300 p-2 text-center">{med.nome}</td>
                                <td className="border-t border-gray-300 p-2 text-center">{med.categoria}</td>
                                <td className="border-t border-gray-300 p-2 text-center">{med.fabricante}</td>
                                <td className="border-t border-gray-300 p-2 text-center">{med.lote}</td>
                                <td className="border-t border-gray-300 p-2 text-center">{med.quantidade}</td>
                                <td className="border-t border-gray-300 p-2 text-center">
                                    {new Date(med.dataValidade).toLocaleDateString("pt-BR")}
                                </td>
                                <td className="border-t border-gray-300 p-2 text-center">
                                    R$ {Number(med.precoVenda).toFixed(2)}
                                </td>
                                <td className="border-t border-gray-300 p-2 text-center">
                                    {confirmandoId === med.id ? (
                                        <div className="flex gap-1 justify-center">
                                            <button
                                                onClick={() => handleDeletar(med.id)}
                                                disabled={deletandoId === med.id}
                                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {deletandoId === med.id ? "..." : "Confirmar"}
                                            </button>
                                            <button
                                                onClick={() => setConfirmandoId(null)}
                                                className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { setErroDeletar(""); setConfirmandoId(med.id); }}
                                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 border border-red-300"
                                        >
                                            Excluir
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
