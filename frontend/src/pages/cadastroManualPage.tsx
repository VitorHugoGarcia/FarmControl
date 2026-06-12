import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarMedicamento } from "../services/medicamento.service";

export default function CadastroManualPage() {
    const navigate = useNavigate();
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    const [form, setForm] = useState({
        nome: "",
        categoria: "",
        fabricante: "",
        lote: "",
        quantidade: "",
        quantidadeMinima: "",
        precoCompra: "",
        precoVenda: "",
        dataValidade: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            quantidadeMinima: Number(form.quantidadeMinima),
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

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Cadastro Manual de Medicamento</h1>

            {erro && <p className="text-red-500 mb-4">{erro}</p>}

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg border border-gray-300">
                <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Categoria</label>
                    <input
                        name="categoria"
                        value={form.categoria}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Fabricante</label>
                    <input
                        name="fabricante"
                        value={form.fabricante}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Lote</label>
                    <input
                        name="lote"
                        value={form.lote}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Data de Validade</label>
                    <input
                        type="date"
                        name="dataValidade"
                        value={form.dataValidade}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Quantidade</label>
                    <input
                        type="number"
                        name="quantidade"
                        value={form.quantidade}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Quantidade Mínima</label>
                    <input
                        type="number"
                        name="quantidadeMinima"
                        value={form.quantidadeMinima}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Preço de Compra</label>
                    <input
                        type="number"
                        name="precoCompra"
                        value={form.precoCompra}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Preço de Venda</label>
                    <input
                        type="number"
                        name="precoVenda"
                        value={form.precoVenda}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div className="col-span-2">
                    <button
                        type="submit"
                        disabled={enviando}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {enviando ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </div>
            </form>
        </div>
  );
}