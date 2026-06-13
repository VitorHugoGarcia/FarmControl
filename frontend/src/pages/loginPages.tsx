import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { realizarLogin } from "../services/loginService";

export default function LoginPage(){
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    
    const aoEnviar = async (evento: any) => {
        evento.preventDefault();
        setErro("");

        if (!login || !senha) {
            setErro("Por favor, preencha todos os campos obrigatórios (*)");
            return;
        }

        try {
            setLoading(true);

            const resposta = await realizarLogin({
                email: login,
                senha: senha
            });

            localStorage.setItem(
                "token",
                resposta.token
            );

            navigate("/homePage");

        } catch (error: any) {

            console.error(error);

            if (error.response?.status === 403) {
                setErro("Usuário desativado.");
                return;
            }

            if (error.response?.status === 401) {
                setErro("Usuário ou senha inválidos.");
                return;
            }

            setErro("Erro ao conectar com o servidor.");

        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8 font-sans">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 shadow-inner text-2xl">
                        📦
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        FarmControl
                    </h1>

                    <p className="text-gray-600">
                        Sistema de Gestão Farmacêutica
                    </p>
                </div>

                <form onSubmit={aoEnviar} className="space-y-6">

                    <div>
                        <label className="block text-sm text-gray-700 mb-2 font-medium">
                            E-mail
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                                👤
                            </span>

                            <input
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="Digite seu email"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-2 font-medium">
                            Senha
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                                🔒
                            </span>

                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Digite sua senha"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                            />
                        </div>
                    </div>

                    {erro && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                            <span className="text-red-600 font-bold">
                                ⚠️
                            </span>

                            <p className="text-red-700 text-sm font-medium">
                                {erro}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-md active:scale-[0.98]"
                    >
                        {loading ? "Carregando..." : "Entrar"}
                    </button>

                </form>
            </div>
        </div>
    );
}