import { useState } from "react";

export default function LoginPage() {
    // Nossas gavetas de memória organizadas
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loading, setLoading] = useState(false);

    // O motor do formulário
    const handleLogin = (evento: any) => {
        evento.preventDefault();
        setLoginError(""); // Limpa erros antigos

        if (!usuario.trim() || !senha.trim()) {
            setLoginError("Por favor, preencha todos os campos.");
            return;
        }

        setLoading(true);
        console.log("Conectando com as credenciais:", usuario, senha);
        setLoading(false);
    };

    return (
        // Fundo com degradê do Figma (bg-gradient-to-br)
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8 font-sans">
            
            {/* Cartão do Formulário */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100">
                
                {/* Cabeçalho / Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 shadow-inner text-2xl">
                        📦
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">FarmControl</h1>
                    <p className="text-gray-600">Sistema de Gestão Farmacêutica</p>
                </div>

                {/* Formulário com espaçamentos do Figma */}
                <form onSubmit={handleLogin} className="space-y-6">
                    
                    {/* Bloco Usuário */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-2 font-medium">
                            Usuário
                        </label>
                        <div className="relative">
                            {/* Ícone posicionado perfeitamente no meio esquerdo */}
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                                👤
                            </span>
                            <input
                                type="text"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                placeholder="Digite seu usuário"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                            />
                        </div>
                    </div>

                    {/* Bloco Senha */}
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

                    {/* Banner de erro com estilo Figma */}
                    {loginError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 animate-pulse">
                            <span className="text-red-600 font-bold">⚠️</span>
                            <p className="text-red-700 text-sm font-medium">{loginError}</p>
                        </div>
                    )}

                    {/* Botão Entrar Azul do Figma */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-md active:scale-[0.98]"
                    >
                        {loading ? "Carregando..." : "Entrar"}
                    </button>

                    {/* Botão Cadastrar */}
                    <div className="text-center">
                        <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center justify-center gap-2 mx-auto hover:underline"
                        >
                            <span>➕</span>
                            Cadastrar novo usuário
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
