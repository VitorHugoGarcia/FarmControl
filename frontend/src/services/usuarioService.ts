import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface CadastroUsuarioData {
    CPF: string;
    nome: string;
    email: string;
    senha: string;
    cargo: string;
}

export async function cadastrarUsuario(dados: CadastroUsuarioData) {
    const token = localStorage.getItem("token");

    const resposta = await axios.post(
        `${API_URL}/usuario`,
        dados,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return resposta.data;
}

export async function atualizarUsuario(CPF: string, dados: {
    CPF: string;
    nome: string;
    email: string;
    cargo: string;
}) {
    const token = localStorage.getItem("token");

    const resposta = await axios.put(
        `${API_URL}/usuario/${CPF}`,
        dados,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return resposta.data;
}

export async function listarUsuarios() {
    const token = localStorage.getItem("token");

    const resposta = await axios.get(
        `${API_URL}/usuario`,
        {
            headers: {
                
                Authorization: `Bearer ${token}`
            }
        }
    );

    return resposta.data;
}