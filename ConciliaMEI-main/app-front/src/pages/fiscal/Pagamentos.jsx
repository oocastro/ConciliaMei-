import React, { useState } from "react";
import { Download, Eye, FileText, Paperclip, Search, X } from "lucide-react";

const pagamentos = [
  {
    id: "000125",
    dataHora: "26/08/2026 10:52",
    tipo: "PIX",
    tomador: "Galvão Amorim Construção e Iincorporação Ltda.",
    cnpj: "09.170.007/0001-26",
    valor: 2300,
    status: "Pendente",
    statusClass: "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    anexo: null
  },
  {
    id: "000124",
    dataHora: "24/08/2026 14:32",
    tipo: "PIX",
    tomador: "Construtora Horizonte S.A.",
    cnpj: "98.765.432/0001-10",
    valor: 3200,
    status: "Conciliado",
    statusClass: "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    anexo: "PDF",
  },
  {
    id: "000123",
    dataHora: "23/08/2026 09:15",
    tipo: "TED",
    tomador: "Consultoria ABC ME",
    cnpj: "11.222.333/0001-44",
    valor: 1500,
    status: "Conciliado",
    statusClass: "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    anexo: "PDF",
  },
  {
    id: "000122",
    dataHora: "22/08/2026 16:48",
    tipo: "Boleto",
    tomador: "Auto Peças Sul",
    cnpj: "33.444.555/0001-66",
    valor: 875.5,
    status: "Pendente",
    statusClass: "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    anexo: null,
  },
  {
    id: "000121",
    dataHora: "20/08/2026 11:02",
    tipo: "PIX",
    tomador: "Distribuidora Norte",
    cnpj: "55.666.777/0001-88",
    valor: 4200,
    status: "Pendente",
    statusClass: "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    anexo: null,
  },
  {
    id: "000119",
    dataHora: "18/08/2026 08:47",
    tipo: "TED",
    tomador: "Logística Rápida Ltda.",
    cnpj: "99.000.111/0001-33",
    valor: 2850,
    status: "Conciliado",
    statusClass: "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    anexo: "PDF",
  },
  {
    id: "000118",
    dataHora: "17/08/2026 15:20",
    tipo: "Cartão",
    tomador: "Gráfica Express",
    cnpj: "22.333.444/0001-55",
    valor: 950,
    status: "Cancelado",
    statusClass: "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
    anexo: "XML",
  },
];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Card de comprovante para mobile */
function PagamentoMobileCard({ item }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Topo: nº + data + tipo | status */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-card-foreground">
              {item.id}
            </span>
            <span className="inline-flex rounded-md bg-[#eef2ff] px-2 py-0.5 text-[10px] font-medium text-[#4338ca]">
              {item.tipo}
            </span>
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">{item.dataHora}</div>
        </div>
        <span
          className={`inline-flex shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ${item.statusClass}`}
        >
          {item.status}
        </span>
      </div>

      {/* Tomador + CNPJ */}
      <div className="mt-3 min-w-0">
        <div className="truncate text-sm font-medium text-card-foreground" title={item.tomador}>
          {item.tomador}
        </div>
        <div className="text-xs text-muted-foreground">{item.cnpj}</div>
      </div>

      {/* Valor + anexo */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-base font-semibold text-card-foreground">
          {currency.format(item.valor)}
        </span>

        {item.anexo ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            {item.anexo}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs italic text-[#9ca3af]">
            Sem anexo
          </span>
        )}
      </div>

      {/* Ações: grid de 3, alvo de toque melhor */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          title="Anexar"
          aria-label="Anexar comprovante"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-card text-xs font-medium text-muted-foreground transition hover:bg-background"
        >
          <Paperclip className="h-4 w-4" />
          Anexar
        </button>
        <button
          title="Visualizar"
          aria-label="Visualizar comprovante"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-card text-xs font-medium text-muted-foreground transition hover:bg-background"
        >
          <Eye className="h-4 w-4" />
          Ver
        </button>
        <button
          title="Baixar"
          aria-label="Baixar comprovante"
          disabled={!item.anexo}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-card text-xs font-medium text-muted-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-4 w-4" />
          Baixar
        </button>
      </div>
    </div>
  );
}

function Pagamentos() {
  const [busca, setBusca] = useState("");

  const filtrados = pagamentos.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.id.toLowerCase().includes(termo) ||
      c.tomador.toLowerCase().includes(termo) ||
      c.cnpj.includes(termo)
    );
  });

  const total = filtrados.reduce((acc, c) => acc + c.valor, 0);

  return (
    <div className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl lg:text-[2.1rem]">
              Pagamentos
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base lg:text-[1.05rem]">
              Registro manual de comprovantes de pagamento e recebimento
            </p>
          </div>

          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f2937] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#111827] sm:w-auto">
            <Download className="h-4 w-4 shrink-0" />
            Exportar CSV
          </button>
        </div>

        {/* Filtros */}
        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:w-105 sm:max-w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nº, tomador ou CPF/CNPJ"
              className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-10 text-sm 	text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-[#7aa0ff] sm:h-12"
            />

            {busca && (
              <button
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-background"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Selects em grid no mobile, dissolvidos no desktop */}
          <div className="grid grid-cols-2 gap-3 sm:contents">
            <select className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm 	text-foreground shadow-sm outline-none focus:border-[#7aa0ff] sm:h-12 sm:w-auto sm:px-4">
              <option>Todos os tipos</option>
              <option>PIX</option>
              <option>TED</option>
              <option>Boleto</option>
              <option>Cartão</option>
            </select>

            <select className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm 	text-foreground shadow-sm outline-none focus:border-[#7aa0ff] sm:h-12 sm:w-auto sm:px-4">
              <option>Todos os status</option>
              <option>Conciliado</option>
              <option>Pendente</option>
              <option>Cancelado</option>
            </select>
          </div>
        </div>

        {/* Mobile: cards */}
        <div className="mt-5 space-y-3 md:hidden">
          {filtrados.map((item) => (
            <PagamentoMobileCard key={item.id} item={item} />
          ))}

          {filtrados.length === 0 && (
            <div className="rounded-xl border border-border bg-card py-12 text-center text-sm text-muted-foreground shadow-sm">
              Nenhum comprovante encontrado.
            </div>
          )}
        </div>

        {/* Desktop: tabela */}
        <div className="mt-8 hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-muted text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[#7a8190]">
              <tr>
                <th className="px-5 py-4">Nº / Data-Hora</th>
                <th className="px-5 py-4">Tipo</th>
                <th className="px-5 py-4">Tomador</th>
                <th className="px-5 py-4">Valor</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Anexo</th>
                <th className="px-5 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-border text-card-foreground transition hover:bg-accent"
                >
                  <td className="px-5 py-4 align-top">
                    <div className="text-base font-semibold">{item.id}</div>
                    <div className="text-sm text-muted-foreground">{item.dataHora}</div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <span className="inline-flex rounded-md bg-[#eef2ff] px-2.5 py-1 text-xs font-medium text-[#4338ca]">
                      {item.tipo}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="text-base font-medium">{item.tomador}</div>
                    <div className="text-sm text-muted-foreground">{item.cnpj}</div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="text-[1.05rem] font-semibold">
                      {currency.format(item.valor)}
                    </div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <span
                      className={`inline-flex rounded-md px-3 py-1 text-sm font-medium ${item.statusClass}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-top">
                    {item.anexo ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        {item.anexo}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm italic text-[#9ca3af]">
                        Sem anexo
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="Anexar"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:bg-background"
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <button
                        title="Visualizar"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:bg-background"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        title="Baixar"
                        disabled={!item.anexo}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    Nenhum comprovante encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé */}
        <div className="mt-5 flex flex-col gap-1 text-xs text-muted-foreground sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <span>
            {filtrados.length} comprovante{filtrados.length !== 1 ? "s" : ""} •{" "}
            {currency.format(total)}
          </span>
          <span>Formatos disponíveis: PDF e PNG</span>
        </div>
      </div>
    </div>
  );
}

export default Pagamentos;