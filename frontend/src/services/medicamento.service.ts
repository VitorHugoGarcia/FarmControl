import type { Medicamento } from "../types/Medicamento";

const API_URL = import.meta.env.VITE_API_URL;

export const listarMedicamentos = async (): Promise<Medicamento[]> => {
    const response = await fetch(`${API_URL}/medicamentos`);
    if (!response.ok) {
        throw new Error("Erro ao buscar medicamentos!");
    }
    return response.json();
}