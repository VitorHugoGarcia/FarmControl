import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface Medicamento {
  id: number;
  nome: string;
  fabricante: string;
  lote: string;
  quantidade: number;
  quantidadeMinima: number;
  precoVenda: number;
  dataValidade: string;
}

interface RelatorioValidade {
  vencidos: Medicamento[];
  sete_dias: Medicamento[];
  trinta_dias: Medicamento[];
}

interface RelatorioEstoque {
  zerados: Medicamento[];
  abaixo_minimo: Medicamento[];
}

interface PeriodoLucro {
  receita: number;
  custo: number;
  perda: number;
  lucro: number;
}

interface RelatorioLucros {
  dia: PeriodoLucro;
  mes: PeriodoLucro;
  ano: PeriodoLucro;
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Gráfico de pizza SVG
function PieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const positivos = data.filter((d) => d.value > 0);
  const total = positivos.reduce((s, d) => s + d.value, 0);

  if (total === 0) return <p className="text-gray-400 text-xs mt-2">Sem movimentações.</p>;

  let cumAngle = -Math.PI / 2;
  const cx = 80, cy = 80, r = 70;

  const slices = positivos.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    return { ...d, x1, y1, x2, y2, largeArc };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <path
            key={i}
            d={`M${cx},${cy} L${s.x1},${s.y1} A${r},${r} 0 ${s.largeArc},1 ${s.x2},${s.y2} Z`}
            fill={s.color}
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
      <ul className="space-y-1.5">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-gray-600">{d.name}</span>
            <span className="font-semibold text-gray-800">{fmt(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CartaoLucro({ titulo, dados }: { titulo: string; dados: PeriodoLucro }) {
  const fatias = [
    { name: "Receita", value: dados.receita, color: "#22c55e" },
    { name: "Custo",   value: dados.custo,   color: "#3b82f6" },
    { name: "Perda",   value: dados.perda,   color: "#ef4444" },
  ];

  const lucroPositivo = dados.lucro >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{titulo}</h3>
      <PieChart data={fatias} />
      <div className={`mt-4 pt-3 border-t border-gray-100 text-sm font-bold ${lucroPositivo ? "text-green-600" : "text-red-500"}`}>
        Lucro líquido: {fmt(dados.lucro)}
      </div>
    </div>
  );
}

// Tabela genérica de medicamentos
function TabelaMedicamentos({ medicamentos, badge, label }: { medicamentos: Medicamento[]; badge: string; label: string }) {
  if (medicamentos.length === 0)
    return <p className="text-sm text-gray-500">Nenhum medicamento nessa categoria.</p>;

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100 text-left text-gray-600">
          <th className="px-3 py-2 font-medium">Nome</th>
          <th className="px-3 py-2 font-medium">Fabricante</th>
          <th className="px-3 py-2 font-medium">Lote</th>
          <th className="px-3 py-2 font-medium">Qtd</th>
          <th className="px-3 py-2 font-medium">Validade</th>
          <th className="px-3 py-2 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {medicamentos.map((m) => (
          <tr key={m.id} className="border-t border-gray-200 hover:bg-gray-50">
            <td className="px-3 py-2">{m.nome}</td>
            <td className="px-3 py-2">{m.fabricante}</td>
            <td className="px-3 py-2">{m.lote}</td>
            <td className="px-3 py-2">{m.quantidade}</td>
            <td className="px-3 py-2">{formatarData(m.dataValidade)}</td>
            <td className="px-3 py-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge}`}>{label}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type Aba = "validade" | "estoque" | "lucros";

export default function RelatoriosPage() {
  const [aba, setAba] = useState<Aba>("validade");
  const [validade, setValidade] = useState<RelatorioValidade | null>(null);
  const [estoque, setEstoque] = useState<RelatorioEstoque | null>(null);
  const [lucros, setLucros] = useState<RelatorioLucros | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setCarregando(true);
    setErro("");

    const fetches: Promise<void>[] = [];

    if (aba === "validade" && !validade) {
      fetches.push(fetch(`${API_URL}/relatorios/validade`).then((r) => r.json()).then(setValidade));
    }
    if (aba === "estoque" && !estoque) {
      fetches.push(fetch(`${API_URL}/relatorios/estoque`).then((r) => r.json()).then(setEstoque));
    }
    if (aba === "lucros" && !lucros) {
      fetches.push(fetch(`${API_URL}/relatorios/lucros`).then((r) => r.json()).then(setLucros));
    }

    Promise.all(fetches)
      .catch(() => setErro("Erro ao carregar relatório."))
      .finally(() => setCarregando(false));
  }, [aba]);

  const tabClass = (t: Aba) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      aba === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
    }`;

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Relatórios</h1>

      <div className="flex border-b border-gray-200 mb-6">
        <button className={tabClass("validade")} onClick={() => setAba("validade")}>Validade</button>
        <button className={tabClass("estoque")} onClick={() => setAba("estoque")}>Estoque Mínimo</button>
        <button className={tabClass("lucros")} onClick={() => setAba("lucros")}>Lucros</button>
      </div>

      {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
      {carregando && <p className="text-gray-500 text-sm">Carregando...</p>}

      {/* === VALIDADE === */}
      {aba === "validade" && validade && (
        <div className="space-y-8">
          <section>
            <h2 className="text-base font-semibold text-red-600 mb-3">Vencidos ({validade.vencidos.length})</h2>
            <TabelaMedicamentos medicamentos={validade.vencidos} badge="bg-red-100 text-red-700" label="Vencido" />
          </section>
          <section>
            <h2 className="text-base font-semibold text-orange-500 mb-3">Vencem em até 7 dias ({validade.sete_dias.length})</h2>
            <TabelaMedicamentos medicamentos={validade.sete_dias} badge="bg-orange-100 text-orange-700" label="7 dias" />
          </section>
          <section>
            <h2 className="text-base font-semibold text-yellow-600 mb-3">Vencem em até 30 dias ({validade.trinta_dias.length})</h2>
            <TabelaMedicamentos medicamentos={validade.trinta_dias} badge="bg-yellow-100 text-yellow-700" label="30 dias" />
          </section>
          <p className="text-xs text-gray-400">* Ordenado por FEFO — os que vencem primeiro aparecem no topo.</p>
        </div>
      )}

      {/* === ESTOQUE === */}
      {aba === "estoque" && estoque && (
        <div className="space-y-8">
          <section>
            <h2 className="text-base font-semibold text-gray-500 mb-3">Estoque zerado ({estoque.zerados.length})</h2>
            <TabelaMedicamentos medicamentos={estoque.zerados} badge="bg-gray-100 text-gray-600" label="Zerado" />
          </section>
          <section>
            <h2 className="text-base font-semibold text-orange-500 mb-3">Abaixo do mínimo ({estoque.abaixo_minimo.length})</h2>
            <TabelaMedicamentos medicamentos={estoque.abaixo_minimo} badge="bg-orange-100 text-orange-700" label="Crítico" />
          </section>
        </div>
      )}

      {/* === LUCROS === */}
      {aba === "lucros" && lucros && (
        <div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CartaoLucro titulo="Hoje" dados={lucros.dia} />
            <CartaoLucro titulo="Este mês" dados={lucros.mes} />
            <CartaoLucro titulo="Este ano" dados={lucros.ano} />
          </div>
        </div>
      )}
    </div>
  );
}
