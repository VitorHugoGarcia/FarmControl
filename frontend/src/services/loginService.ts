import axios from "axios";

const API_URL = "http://localhost:3333";

interface LoginData {
    email: string;
    senha: string;
}

export async function realizarLogin(
    dados: LoginData
) {
    const resposta = await axios.post(
        `${API_URL}/login`,
        dados
    );

    return resposta.data;
}