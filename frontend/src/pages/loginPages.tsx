import { useState } from "react";

export default function LoginPage(){
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);
    
    const aoEnviar = (evento: any) => {
        evento.preventDefault(); 
        setErro(""); 

        if (!login || !senha) {
            setErro("Por favor, preencha todos os campos obrigatórios (*)");
            return;
        }
    };

    return (
        <div className="p-6 font-mono max-w-md mx-auto mt-20 border border-gray-300 rounded-lg bg-gray-50">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">FarmControl - Login</h1>
            
            {/* Bloco de Erro: só aparece se a caixinha "erro" tiver texto */}
            {erro && (
                <p className="mb-4 p-2 text-sm text-red-500 bg-red-100 rounded border border-red-300">
                    {erro}
                </p>
            )}

            <form onSubmit={aoEnviar} className="space-y-4">
                {/* Campo de Usuário */}
                <div>
                    <label className="block mb-1 font-bold">
                        Usuário <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500" 
                        placeholder="Digite seu email"
                    />
                </div>

                {/* Campo de Senha */}
                <div>
                    <label className="block mb-1 font-bold">
                        Senha <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="password" 
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500" 
                        placeholder="Digite sua senha"
                    />
                </div>

                {/* Botão de Entrar */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold p-2 border border-gray-300 rounded transition-colors">
                    {loading ? "Carregando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}