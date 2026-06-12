import type { Medicamento } from "../types/Medicamento";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL =", API_URL);
export const listarMedicamentos = async (): Promise<Medicamento[]> => {
    const response = await fetch(`${API_URL}/medicamentos`);
    if (!response.ok) {
        throw new Error("Erro ao buscar medicamentos!");
    }
    return response.json();
};

export const criarMedicamento = async (medicamento: Omit<Medicamento, "id">): Promise<Medicamento> => {
    const response = await fetch(`${API_URL}/medicamentos`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(medicamento),
    });

    if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Erro ao cadastrar medicamento");
  }

    return response.json();
};