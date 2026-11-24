import React, { useState } from "react";
import { Download, Eye, Plus, Search, Upload, X } from "lucide-react";

/*
 * Sem dados e sem API: tudo chega por props.
 * movimentacoes: [{ id, descricao, tipo: "receita"|"despesa"|"transferencia", categoria, conta,
 *                   data: "YYYY-MM-DD", valor, status: "conciliada"|"pendente"|"revisar"|"duplicada" }]
 */

const TIPOS = {
  receita: { label: "Receita", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  despesa: { label: "Despesa", cls: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  transferencia: { label: "Transferência", cls: "bg-[#eef2ff] text-[#4338ca]" },
};

const STATUS = {
  conciliada: { label: "Conciliada", cls: "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" },
  pendente: { label: "Pendente", cls: "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800" },
  revisar: { label: "Revisar", cls: "bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800" },
  duplicada: { label: "Possível duplicidade", cls: "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800" },
};

const PERIODOS = [
  ["todos", "Todo o período"], ["hoje", "Hoje"], ["7dias", "Últimos 7 dias"],
  ["mes", "Este mês"], ["mesAnterior", "Mês anterior"],
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const campo =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-[#7aa0ff] sm:h-12 sm:w-auto sm:px-4";
const btn =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium text-foreground shadow-sm transition hover:bg-background sm:w-auto";
const btnDark =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f2937] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#111827] sm:w-auto";

const parse = (v) => {
  const [y, m, d] = String(v || "").slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
};
const formatData = (v) => (v ? parse(v).toLocaleDateString("pt-BR") : "—");

function noPeriodo(data, periodo) {
  if (periodo === "todos") return true;
  const d = parse(data);
  const h = new Date();
  const hoje = new Date(h.getFullYear(), h.getMonth(), h.getDate());
  if (periodo === "hoje") return +d === +hoje;
  if (periodo === "7dias") return d <= hoje && d >= new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 6);
  const ini = new Date(hoje.getFullYear(), hoje.getMonth() - (periodo === "mesAnterior" ? 1 : 0), 1);
  return d >= ini && d <= new Date(ini.getFullYear(), ini.getMonth() + 1, 0);
}

function Valor({ item, className = "" }) {
  const cor =
    item.tipo === "receita" ? "text-emerald-600 dark:text-emerald-400"
    : item.tipo === "despesa" ? "text-rose-600 dark:text-rose-400"
    : "text-card-foreground";
  const sinal = item.tipo === "receita" ? "+ " : item.tipo === "despesa" ? "− " : "";
  return <span className={`font-semibold ${cor} ${className}`}>{sinal}{currency.format(Number(item.valor) || 0)}</span>;
}

const TipoBadge = ({ tipo }) => (
  <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${TIPOS[tipo]?.cls}`}>{TIPOS[tipo]?.label}</span>
);
const StatusBadge = ({ status, className = "px-2.5 text-xs" }) => (
  <span className={`inline-flex shrink-0 rounded-md py-1 font-medium ${className} ${STATUS[status]?.cls}`}>{STATUS[status]?.label}</span>
);

const Kpi = ({ titulo, valor, cor = "text-card-foreground" }) => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
    <div className="text-xs font-medium text-muted-foreground sm:text-sm">{titulo}</div>
    <div className={`mt-1 text-xl font-bold tracking-tight sm:text-2xl ${cor}`}>{valor}</div>
  </div>
);

/** Card para mobile */
function MovimentacaoMobileCard({ item, onVer }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-card-foreground" title={item.descricao}>{item.descricao}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{formatData(item.data)} · {item.conta || "—"}</div>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <TipoBadge tipo={item.tipo} />
          <span className="text-xs text-muted-foreground">{item.categoria || "Sem categoria"}</span>
        </div>
        <Valor item={item} className="text-base" />
      </div>
      <button
        onClick={() => onVer?.(item)}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md border border-border bg-card text-xs font-medium text-muted-foreground transition hover:bg-background"
      >
        <Eye className="h-4 w-4" />Ver detalhes
      </button>
    </div>
  );
}

function Movimentacoes({ movimentacoes = [], onNova, onImportar, onExportar, onVer }) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [status, setStatus] = useState("todos");
  const [periodo, setPeriodo] = useState("mes");

  const filtrados = movimentacoes
    .filter((m) =>
      String(m.descricao || "").toLowerCase().includes(busca.trim().toLowerCase()) &&
      (tipo === "todos" || m.tipo === tipo) &&
      (status === "todos" || m.status === status) &&
      noPeriodo(m.data, periodo)
    )
    .sort((a, b) => parse(b.data) - parse(a.data));

  const soma = (t) => filtrados.filter((m) => m.tipo === t).reduce((acc, m) => acc + (Number(m.valor) || 0), 0);
  const receitas = soma("receita");
  const despesas = soma("despesa");
  const aConferir = filtrados.filter((m) => m.status !== "conciliada").length;

  return (
    <div className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl lg:text-[2.1rem]">
              Movimentações Financeiras
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base lg:text-[1.05rem]">
              Acompanhe suas receitas, despesas e movimentações bancárias.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button className={btnDark} onClick={() => onNova?.()}><Plus className="h-4 w-4 shrink-0" />Nova movimentação</button>
            <button className={btn} onClick={() => onImportar?.()}><Upload className="h-4 w-4 shrink-0" />Importar extrato</button>
            <button className={btn} onClick={() => onExportar?.(filtrados)}><Download className="h-4 w-4 shrink-0" />Exportar movimentações</button>
          </div>
        </div>

        {/* Indicadores */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 lg:grid-cols-4">
          <Kpi titulo="Receitas" valor={currency.format(receitas)} cor="text-emerald-600 dark:text-emerald-400" />
          <Kpi titulo="Despesas" valor={currency.format(despesas)} cor="text-rose-600 dark:text-rose-400" />
          <Kpi titulo="Saldo do período" valor={currency.format(receitas - despesas)} />
          <Kpi titulo="A conferir" valor={aConferir} />
        </div>

        {/* Filtros */}
        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:w-105 sm:max-w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text" value={busca} onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por descrição"
              className={`${campo} !w-full pl-11 pr-10`}
            />
            {busca && (
              <button onClick={() => setBusca("")} aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-background">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:contents">
            <select className={campo} value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="todos">Todas</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
              <option value="transferencia">Transferências</option>
            </select>
            <select className={campo} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="todos">Todos os status</option>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select className={`${campo} col-span-2`} value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
              {PERIODOS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Mobile: cards */}
        <div className="mt-5 space-y-3 md:hidden">
          {filtrados.map((item) => <MovimentacaoMobileCard key={item.id} item={item} onVer={onVer} />)}
          {filtrados.length === 0 && <Vazio vazioTotal={movimentacoes.length === 0} onNova={onNova} onImportar={onImportar} />}
        </div>

        {/* Desktop: tabela */}
        <div className="mt-8 hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-muted text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[#7a8190]">
              <tr>
                <th className="px-5 py-4">Descrição</th>
                <th className="px-5 py-4">Tipo</th>
                <th className="px-5 py-4">Categoria</th>
                <th className="px-5 py-4">Conta</th>
                <th className="px-5 py-4">Data</th>
                <th className="px-5 py-4">Valor</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((item) => (
                <tr key={item.id} className="border-t border-border text-card-foreground transition hover:bg-accent">
                  <td className="max-w-[16rem] px-5 py-4 align-top">
                    <div className="truncate text-base font-medium" title={item.descricao}>{item.descricao}</div>
                  </td>
                  <td className="px-5 py-4 align-top"><TipoBadge tipo={item.tipo} /></td>
                  <td className="px-5 py-4 align-top text-sm">{item.categoria || "—"}</td>
                  <td className="px-5 py-4 align-top text-sm">{item.conta || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-4 align-top text-sm">{formatData(item.data)}</td>
                  <td className="whitespace-nowrap px-5 py-4 align-top"><Valor item={item} className="text-[1.05rem]" /></td>
                  <td className="px-5 py-4 align-top"><StatusBadge status={item.status} className="px-3 text-sm" /></td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center justify-end">
                      <button title="Ver detalhes" onClick={() => onVer?.(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:bg-background">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={8} className="p-0"><Vazio vazioTotal={movimentacoes.length === 0} onNova={onNova} onImportar={onImportar} /></td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé */}
        <div className="mt-5 text-xs text-muted-foreground sm:mt-6 sm:text-sm">
          {filtrados.length} movimentaç{filtrados.length !== 1 ? "ões" : "ão"}
        </div>
      </div>
    </div>
  );
}

function Vazio({ vazioTotal, onNova, onImportar }) {
  if (!vazioTotal) {
    return <div className="rounded-xl border border-border bg-card py-12 text-center text-sm text-muted-foreground shadow-sm md:rounded-none md:border-0 md:shadow-none">Nenhuma movimentação encontrada.</div>;
  }
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <p className="text-sm font-medium text-card-foreground">Nenhuma movimentação cadastrada</p>
      <p className="max-w-sm text-xs text-muted-foreground">Cadastre sua primeira movimentação ou importe um extrato bancário.</p>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <button className={btnDark} onClick={() => onNova?.()}><Plus className="h-4 w-4" />Cadastrar movimentação</button>
        <button className={btn} onClick={() => onImportar?.()}><Upload className="h-4 w-4" />Importar extrato</button>
      </div>
    </div>
  );
}

export default Movimentacoes;