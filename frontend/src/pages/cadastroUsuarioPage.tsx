import { useState } from "react";
import { cadastrarUsuario } from "../services/usuarioService";
import { useNavigate } from "react-router-dom";

export default function CadastroUsuarioPage() {
    const [nome, setNome] = useState("");
    const [CPF, setCPF] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [cargo, setCargo] = useState("");

    const formatarCPF = (valor: string) => {
        const nums = valor.replace(/\D/g, "").slice(0, 11);
        return nums
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setErro("");
        setSucesso("");

        if (!nome || !CPF || !email || !senha || !confirmarSenha || !cargo) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        try {
            setLoading(true);

            await cadastrarUsuario({nome, CPF, email, senha, cargo});

            navigate("/usuarios");

        } catch (error: any) {

            setErro(
                error.response?.data?.erro ||
                "Erro ao cadastrar usuário."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8">

                <h1 className="text-3xl font-bold mb-2">
                    Adicionar Novo Usuário
                </h1>

                <p className="text-gray-500 mb-8">
                    Preencha os dados do usuário para liberar acesso ao sistema.
                </p>

                {erro && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
                        {erro}
                    </div>
                )}

                {sucesso && (
                    <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">
                        {sucesso}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div>
                        <label className="block mb-2 font-medium">
                            Nome Completo *
                        </label>

                        <input
                            type="text"
                            value={nome}
                            onChange={(e) =>
                                setNome(e.target.value)
                            }
                            className="w-full border rounded-lg p-3"
                            placeholder="Ex: João da Silva"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">
                                CPF *
                            </label>

                            <input
                                type="text"
                                value={CPF}
                                onChange={(e) => setCPF(formatarCPF(e.target.value))}
                                className="w-full border rounded-lg p-3"
                                placeholder="000.000.000-00"
                                maxLength={14}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">
                                Cargo *
                            </label>

                            <select
                                value={cargo}
                                onChange={(e) =>
                                    setCargo(e.target.value)
                                }
                                className="w-full border rounded-lg p-3"
                            >
                                <option value="">
                                    Selecione um cargo
                                </option>

                                <option value="BALCONISTA">
                                    Balconista
                                </option>

                                <option value="FARMACEUTICO">
                                    Farmacêutico
                                </option>

                                <option value="ADMINISTRADOR">
                                    Administrador
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">
                                E-mail *
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full border rounded-lg p-3"
                                placeholder="usuario@email.com"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">
                                Senha *
                            </label>

                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Confirmar Senha *
                        </label>
                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            className={`w-full border rounded-lg p-3 ${confirmarSenha && senha !== confirmarSenha ? "border-red-400" : ""}`}
                        />
                        {confirmarSenha && senha !== confirmarSenha && (
                            <p className="text-red-500 text-sm mt-1">As senhas não coincidem.</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                        type="button"
                        onClick={() => navigate("/usuarios")}
                        >
                        Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {loading
                                ? "Cadastrando..."
                                : "Cadastrar Usuário"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}