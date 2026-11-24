
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  FileText,
  Search,
  Wallet,
  X,
} from "lucide-react";

const movimentacoes = [];

const formatarMoeda = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);

const formatarData = (data) => {
  if (!data) return "—";

  return new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR");
};

function pertenceAoPeriodo(data, periodo) {
  if (!data || periodo === "todos") return true;

  const hoje = new Date();
  const dataMovimento = new Date(`${data}T12:00:00`);

  if (periodo === "hoje") {
    return dataMovimento.toDateString() === hoje.toDateString();
  }

  if (periodo === "7dias") {
    const limite = new Date();
    limite.setDate(hoje.getDate() - 7);

    return dataMovimento >= limite && dataMovimento <= hoje;
  }

  if (periodo === "mes") {
    return (
      dataMovimento.getMonth() === hoje.getMonth() &&
      dataMovimento.getFullYear() === hoje.getFullYear()
    );
  }

  if (periodo === "anterior") {
    const mesAnterior = new Date(
      hoje.getFullYear(),
      hoje.getMonth() - 1,
      1
    );

    return (
      dataMovimento.getMonth() === mesAnterior.getMonth() &&
      dataMovimento.getFullYear() === mesAnterior.getFullYear()
    );
  }

  return true;
}

export default function Extratos() {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [periodo, setPeriodo] = useState("todos");

  const extratosFiltrados = useMemo(() => {
    return movimentacoes.filter((item) => {
      const termo = busca.toLowerCase();

      const correspondeBusca =
        item.descricao?.toLowerCase().includes(termo) ||
        item.categoria?.toLowerCase().includes(termo) ||
        item.conta?.toLowerCase().includes(termo);

      const correspondeTipo =
        tipo === "todos" || item.tipo === tipo;

      const correspondePeriodo = pertenceAoPeriodo(
        item.data,
        periodo
      );

      return (
        correspondeBusca &&
        correspondeTipo &&
        correspondePeriodo
      );
    });
  }, [busca, tipo, periodo]);

  const totais = useMemo(() => {
    const entradas = extratosFiltrados
      .filter((item) => item.tipo === "receita")
      .reduce((total, item) => total + Number(item.valor || 0), 0);

    const saidas = extratosFiltrados
      .filter((item) => item.tipo === "despesa")
      .reduce((total, item) => total + Number(item.valor || 0), 0);

    return {
      entradas,
      saidas,
      saldo: entradas - saidas,
    };
  }, [extratosFiltrados]);

  function exportarCSV() {
    if (extratosFiltrados.length === 0) return;

    const cabecalho = [
      "Descricao",
      "Tipo",
      "Categoria",
      "Conta",
      "Data",
      "Valor",
      "Status",
    ];

    const linhas = extratosFiltrados.map((item) => [
      item.descricao,
      item.tipo,
      item.categoria,
      item.conta,
      item.data,
      item.valor,
      item.status,
    ]);

    const conteudo = [
      cabecalho,
      ...linhas,
    ]
      .map((linha) =>
        linha
          .map((valor) => `"${String(valor ?? "").replaceAll('"', '""')}"`)
          .join(";")
      )
      .join("\n");

    const arquivo = new Blob(
      ["\uFEFF" + conteudo],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");

    link.href = url;
    link.download = "extratos-conciliamei.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  const limparFiltros = () => {
    setBusca("");
    setTipo("todos");
    setPeriodo("todos");
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Cabeçalho */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Financeiro / Extratos
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Extratos financeiros
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Consulte e acompanhe as movimentações financeiras do seu negócio.
            </p>
          </div>

          <button
            onClick={exportarCSV}
            disabled={extratosFiltrados.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={18} />
            Exportar extrato
          </button>
        </section>

        {/* Indicadores */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total de entradas
              </p>

              <div className="rounded-lg bg-green-500/10 p-2 text-green-600">
                <ArrowUpRight size={20} />
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {formatarMoeda(totais.entradas)}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Receitas no período selecionado
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total de saídas
              </p>

              <div className="rounded-lg bg-red-500/10 p-2 text-red-600">
                <ArrowDownRight size={20} />
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {formatarMoeda(totais.saidas)}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Despesas no período selecionado
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Saldo do período
              </p>

              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Wallet size={20} />
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {formatarMoeda(totais.saldo)}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Entradas menos saídas
            </p>
          </div>

        </section>

        {/* Filtros */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Movimentações</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pesquise e filtre seus lançamentos.
              </p>
            </div>

            {(busca || tipo !== "todos" || periodo !== "todos") && (
              <button
                onClick={limparFiltros}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <X size={15} />
                Limpar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar movimentação..."
                className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
              />
            </div>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="todos">Todos os tipos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
              <option value="transferencia">Transferências</option>
            </select>

            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="todos">Todo o período</option>
              <option value="hoje">Hoje</option>
              <option value="7dias">Últimos 7 dias</option>
              <option value="mes">Este mês</option>
              <option value="anterior">Mês anterior</option>
            </select>

          </div>
        </section>

        {/* Tabela */}
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Histórico financeiro</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {extratosFiltrados.length} movimentação(ões) encontrada(s)
            </p>
          </div>

          {extratosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="rounded-full bg-muted p-4">
                <FileText
                  size={30}
                  className="text-muted-foreground"
                />
              </div>

              <h3 className="mt-4 font-semibold">
                Nenhuma movimentação encontrada
              </h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Quando houver movimentações financeiras cadastradas,
                elas aparecerão aqui para consulta e exportação.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-5 py-4 font-medium">Descrição</th>
                      <th className="px-5 py-4 font-medium">Categoria</th>
                      <th className="px-5 py-4 font-medium">Conta</th>
                      <th className="px-5 py-4 font-medium">Data</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 text-right font-medium">Valor</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {extratosFiltrados.map((item) => (
                      <tr key={item.id} className="transition hover:bg-muted/30">
                        <td className="px-5 py-4 font-medium">
                          {item.descricao}
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {item.categoria || "—"}
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {item.conta || "—"}
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {formatarData(item.data)}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                            {item.status || "Sem status"}
                          </span>
                        </td>

                        <td
                          className={`px-5 py-4 text-right font-semibold ${
                            item.tipo === "receita"
                              ? "text-green-600"
                              : item.tipo === "despesa"
                                ? "text-red-600"
                                : "text-foreground"
                          }`}
                        >
                          {item.tipo === "despesa" ? "− " : "+ "}
                          {formatarMoeda(item.valor)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-border md:hidden">
                {extratosFiltrados.map((item) => (
                  <div key={item.id} className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.descricao}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.categoria || "Sem categoria"} · {formatarData(item.data)}
                        </p>
                      </div>

                      <span
                        className={`whitespace-nowrap text-sm font-semibold ${
                          item.tipo === "receita"
                            ? "text-green-600"
                            : item.tipo === "despesa"
                              ? "text-red-600"
                              : "text-foreground"
                        }`}
                      >
                        {item.tipo === "despesa" ? "− " : "+ "}
                        {formatarMoeda(item.valor)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.conta || "Sem conta"}</span>
                      <span>{item.status || "Sem status"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </section>

      </div>
    </main>
  );
}
