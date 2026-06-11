import { useState, useEffect } from "react";
import { listarMedicamentos } from "../services/medicamento.service";
import type { Medicamento } from "../types/Medicamento";

export default function HomePage() {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        listarMedicamentos()
        .then(setMedicamentos)
        .catch(() => setErro("Erro ao carregar medicamentos"))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-4">Carregando...</p>;
    if (erro) return <p className="p-4 text-red-500">{erro}</p>;

    return (
        <div className="p-6 font-mono">
            {
            }
            <h1 className="text-2xl font-bold mb-4 pl-3">Estoque de Medicamentos</h1>
            <div className="overflow-auto rounded-lg">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Produto</th>
                            <th className="p-2">Categoria</th>
                            <th className="p-2">Fabricante</th>
                            <th className="p-2">Lote</th>
                            <th className="p-2">Estoque</th>
                            <th className="p-2">Validade</th>
                            <th className="p-2">Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicamentos.map((med) => {
                            const estoqueBaixo = med.quantidade <= med.quantidadeMinima;
                            return (
                                <tr key={med.id} className={estoqueBaixo ? "bg-red-100" : ""}>
                                    <td className="border-t border-gray-300 p-2 text-center">{med.nome}</td>
                                    <td className="border-t border-gray-300 p-2 text-center">{med.categoria}</td>
                                    <td className="border-t border-gray-300 p-2 text-center">{med.fabricante}</td>
                                    <td className="border-t border-gray-300 p-2 text-center">{med.lote}</td>
                                    <td className="border-t border-gray-300 p-2 text-center">{med.quantidade}</td>
                                    <td className="border-t border-gray-300 p-2 text-center">
                                    {new Date(med.dataValidade).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="border-t border-gray-300 p-2 text-center">
                                    R$ {med.preco.toFixed(2)}
                                    </td>
                                </tr>
                            );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}