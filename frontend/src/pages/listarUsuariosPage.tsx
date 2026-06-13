import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarUsuarios } from "../services/usuarioService";

interface Usuario {
    CPF: string;
    nome: string;
    email: string;
    cargo: string;
    ativo: boolean;
}

export default function ListarUsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        async function carregarUsuarios() {
            try {
                const resposta = await listarUsuarios();
                setUsuarios(resposta);
            } catch (error) {
                console.error(error);
                setErro("Erro ao carregar usuários.");
            } finally {
                setLoading(false);
            }
        }

        carregarUsuarios();
    }, []);

    if (loading) {
        return <p className="p-6">Carregando usuários...</p>;
    }

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-2">
                Usuários
            </h1>

            <p className="text-gray-500 mb-6">
                Gerencie os usuários cadastrados no sistema.
            </p>

            {erro && (
                <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
                    {erro}
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Nome</th>
                            <th className="p-3 text-left">CPF</th>
                            <th className="p-3 text-left">E-mail</th>
                            <th className="p-3 text-left">Cargo</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-right">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr
                                key={usuario.CPF}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="p-3">{usuario.nome}</td>
                                <td className="p-3">{usuario.CPF}</td>
                                <td className="p-3">{usuario.email}</td>
                                <td className="p-3">{usuario.cargo}</td>

                                <td className="p-3">
                                    <span
                                        className={
                                            usuario.ativo
                                                ? "px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                                                : "px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
                                        }
                                    >
                                        {usuario.ativo ? "Ativo" : "Inativo"}
                                    </span>
                                </td>

                                <td className="p-3 text-right">
                                    <button
                                        onClick={() =>
                                            navigate("/editar-usuario", {
                                                state: usuario,
                                            })
                                        }
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}