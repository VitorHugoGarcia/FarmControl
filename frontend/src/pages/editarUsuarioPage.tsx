import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { atualizarUsuario } from "../services/usuarioService";

export default function EditarUsuarioPage() {
    const location = useLocation();
    const usuario = location.state;

    const [cpf, setCpf] = useState(usuario.CPF);
    const [nome, setNome] = useState(usuario.nome);
    const [email, setEmail] = useState(usuario.email);
    const [cargo, setCargo] = useState(usuario.cargo);

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const cpfOriginal = usuario.CPF;
    const navigate = useNavigate();

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setErro("");
        setSucesso("");

        try {
            setLoading(true);

            await atualizarUsuario(
                cpfOriginal,
                {
                    CPF: cpf,
                    nome,
                    email,
                    cargo
                }
            );

            navigate("/usuarios")

        } catch (error: any) {

            setErro(
                error.response?.data?.erro ||
                "Erro ao atualizar usuário."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8">

                <h1 className="text-3xl font-bold mb-2">
                    Editar Usuário
                </h1>

                <p className="text-gray-500 mb-8">
                    Atualize os dados do usuário.
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
                            Nome Completo
                        </label>

                        <input
                            type="text"
                            value={nome}
                            onChange={(e) =>
                                setNome(e.target.value)
                            }
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">

                        <div>
                            <label className="block mb-2 font-medium">
                                CPF
                            </label>

                            <input
                                type="text"
                                value={cpf}
                                onChange={(e) =>
                                    setCpf(e.target.value)
                                }
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">
                                Cargo
                            </label>

                            <select
                                value={cargo}
                                onChange={(e) =>
                                    setCargo(e.target.value)
                                }
                                className="w-full border rounded-lg p-3"
                            >
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

                    <div>
                        <label className="block mb-2 font-medium">
                            E-mail
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {
                                loading
                                    ? "Salvando..."
                                    : "Salvar Alterações"
                            }
                        </button>
                    </div>

                </form>
            </div>

        </div>
    );
}