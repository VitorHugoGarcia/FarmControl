import type { ItemVenda } from "../types/ItemVenda";
import type { Medicamento,  } from "../types/Medicamento";
import type { ResultadoVenda } from "../types/ResultadoVenda";

const API_URL = import.meta.env.VITE_API_URL;

export const listarMedicamentos = async (): Promise<Medicamento[]> => {
    const response = await fetch(`${API_URL}/medicamentos`);
    if (!response.ok) {
        throw new Error("Erro ao buscar medicamentos!");
    }
    return response.json();
};

export const importarNotaFiscal = async (arquivo: File, precoVenda: number): Promise<any> => {
  const formData = new FormData();
  formData.append("xml", arquivo);
  formData.append("precoVenda", String(precoVenda));

  const response = await fetch(`${API_URL}/medicamentos/nota-fiscal`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Erro ao importar nota fiscal");
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

export const realizarVenda = async (itens: ItemVenda[]): Promise<ResultadoVenda> => {
    const payload = { itens }; 

    const response = await fetch(`${API_URL}/medicamentos/compra`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Erro ao processar a venda!");
    }

    return response.json();
};

export const obterLinkDownload = (nomeArquivo: string): string => {
    return `${API_URL}/medicamentos/compra/download/${nomeArquivo}`;
};