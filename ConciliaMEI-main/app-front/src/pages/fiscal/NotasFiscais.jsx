import { useState, useEffect } from "react";
import { Eye, Search, Plus, X, Download, Upload, Loader2, AlertCircle } from "lucide-react";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function NFSe() {
  const [notas, setNotas] = useState([]);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todos os status");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarNotas() {
      try {
        const cnpj = "12345678000199";

        const response = await fetch(
          `http://localhost:8080/api/notas?cnpj=${cnpj}`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar notas");
        }

        const dados = await response.json();

        setNotas(
          dados.map((nota) => ({
            id: String(nota.numero ?? nota.id ?? ""),
            dataHora: nota.dataEmissao
              ? new Date(nota.dataEmissao).toLocaleString("pt-BR")
              : "-",
            DPS: String(nota.DPS ?? nota.dps ?? "1"),
            tomador: nota.tomador ?? "-",
            cnpj: nota.cnpj ?? nota.cnpjTomador ?? "-",
            valor: Number(nota.valor ?? 0),
            status: nota.status ?? "Pendente",
            statusClass: "bg-amber-100 text-amber-700 border border-amber-200",
          }))
        );
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar as notas.");
      } finally {
        setCarregando(false);
      }
    }

    buscarNotas();
  }, []);

  const filtrados = notas.filter((nota) => {
    const termo = busca.toLowerCase();

    const correspondeBusca =
      nota.id.toLowerCase().includes(termo) ||
      nota.tomador.toLowerCase().includes(termo) ||
      nota.cnpj.includes(termo);

    const correspondeStatus =
      statusFiltro === "Todos os status" ||
      nota.status === statusFiltro;

    return correspondeBusca && correspondeStatus;
  });

  const total = filtrados.reduce((acc, nota) => acc + nota.valor, 0);

  return (
    <div className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl lg:text-[2.1rem]">
              NFS-e
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base lg:text-[1.05rem]">
              Notas fiscais de serviço emitidas e recebidas
            </p>
          </div>

          {/* Botões: grid 2 colunas no mobile, inline no desktop */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-[#f9fafb] sm:px-5 sm:py-3 sm:text-sm">
              <Upload className="h-4 w-4 shrink-0" />
              <span className="truncate">Importar</span>
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f2937] px-3 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#111827] sm:px-5 sm:py-3 sm:text-sm">
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate">Emitir</span>
            </button>
          </div>
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
              className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-10 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-[#7aa0ff] sm:h-12"
            />

            {busca && (
              <button
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-accent"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Selects em grid no mobile */}
          <div className="grid grid-cols-2 gap-3 sm:contents">
            <select className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground shadow-sm outline-none focus:border-[#7aa0ff] sm:h-12 sm:w-auto sm:px-4">
              <option>Todas as séries</option>
              <option>Série 1</option>
              <option>Série 2</option>
            </select>

            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground shadow-sm outline-none focus:border-[#7aa0ff] sm:h-12 sm:w-auto sm:px-4"
            >
              <option>Todos os status</option>
              <option>Conciliado</option>
              <option>Pendente</option>
              <option>Cancelado</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {carregando && (
          <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-16 text-sm text-muted-foreground shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando NFS-e...
          </div>
        )}

        {/* Erro */}
        {!carregando && erro && (
          <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-12 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            <AlertCircle className="h-4 w-4" />
            {erro}
          </div>
        )}

        {/* Conteúdo */}
        {!carregando && !erro && (
          <>
            {/* Mobile: cards */}
            <div className="mt-5 space-y-3 md:hidden">
              {filtrados.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  {/* Topo: número + status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-card-foreground">
                          {item.id}
                        </span>
                        <span className="inline-flex rounded-md bg-[#eef2ff] px-2 py-0.5 text-[10px] font-medium text-[#4338ca]">
                          DPS {item.DPS}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {item.dataHora}
                      </div>
                    </div>
                    <span
                      className={`inline-flex shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ${item.statusClass}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Tomador */}
                  <div className="mt-3 min-w-0">
                    <div className="truncate text-sm font-medium text-card-foreground" title={item.tomador}>
                      {item.tomador}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.cnpj}</div>
                  </div>

                  {/* Valor + ações */}
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-base font-semibold text-card-foreground">
                      {currency.format(item.valor)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        title="Visualizar NFS-e"
                        aria-label="Visualizar NFS-e"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:bg-accent"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        title="Baixar NFS-e"
                        aria-label="Baixar NFS-e"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:bg-accent"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filtrados.length === 0 && (
                <div className="rounded-xl border border-border bg-card py-12 text-center text-sm text-muted-foreground shadow-sm">
                  Nenhuma NFS-e encontrada.
                </div>
              )}
            </div>

            {/* Desktop: tabela */}
            <div className="mt-8 hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead className="bg-muted text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[#7a8190]">
                  <tr>
                    <th className="px-5 py-4">Nº / Data-Hora</th>
                    <th className="px-5 py-4">DPS</th>
                    <th className="px-5 py-4">Tomador</th>
                    <th className="px-5 py-4">Valor</th>
                    <th className="px-5 py-4">Status</th>
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
                          {item.DPS}
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

                      <td className="px-5 py-4 align-middle">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Visualizar NFS-e"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:bg-accent"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            title="Baixar NFS-e"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:bg-accent"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtrados.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-sm text-muted-foreground"
                      >
                        Nenhuma NFS-e encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Rodapé */}
            <div className="mt-5 flex flex-col gap-1 text-xs text-muted-foreground sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
              <span>
                {filtrados.length} NFS-e
                {filtrados.length !== 1 ? "s" : ""} • {currency.format(total)}
              </span>
              <span>Formatos disponíveis: PDF e XML</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NFSe;