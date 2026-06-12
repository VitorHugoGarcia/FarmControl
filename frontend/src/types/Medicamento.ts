export interface Medicamento {
  id: number;
  nome: string;
  categoria: string;
  fabricante: string;
  lote: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  dataValidade: string;
}