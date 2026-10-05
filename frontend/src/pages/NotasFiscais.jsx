import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDownToLine, Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Ajuste para a URL do back mikael
const API_URL = import.meta.env?.VITE_API_URL ?? "/api";

/*
 * GET {API_URL}/notas-fiscais retorna uma lista (ou { items: [...] }) com:
 * {
 *   numero: "000124",
 *   dataEmissao: "2026-08-24",          // ISO
 *   emissor: { nome, cnpj },
 *   tomador: { nome, cnpj },
 *   valor: 3200
 * }
 * Se o backend usa outros nomes de campo, ajuste só normalizarNota.
 */

function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value ?? 0);
}

function normalizarNota(raw) {
    const data = parseISO(String(raw.dataEmissao));
    return {
        numero: String(raw.numero),
        dia: format(data, "dd/MM", { locale: ptBR }),
        periodo: format(data, "yyyy-MM"), // chave do mês, ex: "2026-08"
        periodoLabel: format(data, "MMM/yyyy", { locale: ptBR }),
        emissor: raw.emissor?.nome ?? "",
        cnpjEmissor: raw.emissor?.cnpj ?? "",
        tomador: raw.tomador?.nome ?? "",
        cnpjTomador: raw.tomador?.cnpj ?? "",
        valor: Number(raw.valor) || 0,
    };
}

const somenteDigitos = (texto) => texto.replace(/\D/g, "");

function MonthCard({ month, selected, onSelect }) {
    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={cn(
                "group rounded-xl border p-4 shadow-sm transition-all duration-200 ease-out",
                "hover:-translate-y-0.5 hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                    ? "border-foreground bg-muted ring-1 ring-foreground"
                    : "bg-card hover:bg-background"
            )}
        >
            <div className="text-center text-[0.95rem] font-semibold capitalize text-muted-foreground">
                {month.label}
            </div>
            <div className="mt-3 text-center text-[2.1rem] font-extrabold tracking-tight">
                {month.total}
            </div>
            <div className="mt-1 text-center text-sm tabular-nums text-muted-foreground">
                {formatCurrency(month.soma)}
            </div>
        </button>
    );
}

function NotasFiscais() {
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("todos");
    const [busca, setBusca] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function carregar() {
            try {
                setLoading(true);
                setErro(null);

                const res = await fetch(`${API_URL}/notas-fiscais`, {
                    signal: controller.signal,
                    headers: { Accept: "application/json" },
                });
                if (!res.ok) throw new Error(`Erro ${res.status} ao buscar as notas fiscais`);

                const data = await res.json();
                const lista = Array.isArray(data) ? data : data.items ?? [];
                setNotas(lista.map(normalizarNota));
            } catch (e) {
                if (e.name !== "AbortError") setErro(e.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        carregar();
        return () => controller.abort();
    }, []);

    // Cards de mês calculados a partir dos dados (mais recente primeiro)
    const monthCards = useMemo(() => {
        const porMes = new Map();
        for (const n of notas) {
            const atual = porMes.get(n.periodo) ?? {
                key: n.periodo,
                label: n.periodoLabel,
                total: 0,
                soma: 0,
            };
            atual.total += 1;
            atual.soma += n.valor;
            porMes.set(n.periodo, atual);
        }
        const meses = [...porMes.values()].sort((a, b) => b.key.localeCompare(a.key));

        return [
            {
                key: "todos",
                label: "Todos",
                total: notas.length,
                soma: notas.reduce((acc, n) => acc + n.valor, 0),
            },
            ...meses,
        ];
    }, [notas]);

    const notasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        const termoDigitos = somenteDigitos(termo);

        return notas.filter((n) => {
            if (selectedMonth !== "todos" && n.periodo !== selectedMonth) return false;
            if (!termo) return true;

            return (
                n.numero.toLowerCase().includes(termo) ||
                (termoDigitos &&
                    (somenteDigitos(n.cnpjEmissor).includes(termoDigitos) ||
                        somenteDigitos(n.cnpjTomador).includes(termoDigitos)))
            );
        });
    }, [notas, selectedMonth, busca]);

    const labelPeriodo = monthCards.find((m) => m.key === selectedMonth)?.label ?? "Todos";

    function baixarNota(numero) {
        window.open(`${API_URL}/notas-fiscais/${encodeURIComponent(numero)}/download`, "_blank");
    }

    function baixarPeriodo() {
        const params = new URLSearchParams();
        if (selectedMonth !== "todos") params.set("periodo", selectedMonth);
        window.open(`${API_URL}/notas-fiscais/download?${params.toString()}`, "_blank");
    }

    return (
        <div className="space-y-4">
            <Card className="rounded-2xl">
                <CardHeader>
                    <h1 className="text-2xl font-extrabold tracking-tight">Notas Fiscais</h1>
                    <p className="text-sm text-muted-foreground">
                        Notas fiscais emitidas e recebidas, organizadas por período.
                    </p>
                </CardHeader>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-[420px]">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar por número ou CNPJ"
                        className="h-12 w-full rounded-xl border border-input bg-card pl-11 pr-4 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>

                <Button
                    type="button"
                    onClick={baixarPeriodo}
                    disabled={loading || notasFiltradas.length === 0}
                    className="h-12 gap-2 rounded-xl px-5 font-bold shadow-sm"
                >
                    <Download className="h-4 w-4" />
                    Baixar período (zip)
                </Button>
            </div>

            {erro && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-medium text-destructive">
                    {erro}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {monthCards.map((month) => (
                    <MonthCard
                        key={month.key}
                        month={month}
                        selected={selectedMonth === month.key}
                        onSelect={() => setSelectedMonth(month.key)}
                    />
                ))}
            </div>

            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted hover:bg-muted">
                                <TableHead className="px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
                                    NFS-e
                                </TableHead>
                                <TableHead className="px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
                                    Emissor
                                </TableHead>
                                <TableHead className="px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
                                    Tomador
                                </TableHead>
                                <TableHead className="px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
                                    Valor
                                </TableHead>
                                <TableHead className="w-16 px-5 py-4">
                                    <span className="sr-only">Baixar</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        Carregando notas fiscais...
                                    </TableCell>
                                </TableRow>
                            ) : notasFiltradas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        Nenhuma nota fiscal encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                notasFiltradas.map((item) => (
                                    <TableRow key={item.numero}>
                                        <TableCell className="px-5 py-4 align-top">
                                            <div className="text-lg font-bold tabular-nums">{item.numero}</div>
                                            <div className="text-sm text-muted-foreground">{item.dia}</div>
                                        </TableCell>

                                        <TableCell className="px-5 py-4 align-top">
                                            <div className="max-w-64 truncate text-base font-medium" title={item.emissor}>
                                                {item.emissor}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{item.cnpjEmissor}</div>
                                        </TableCell>

                                        <TableCell className="px-5 py-4 align-top">
                                            <div className="max-w-64 truncate text-base font-medium" title={item.tomador}>
                                                {item.tomador}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{item.cnpjTomador}</div>
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap px-5 py-4 align-top text-[1.05rem] font-bold tabular-nums">
                                            {formatCurrency(item.valor)}
                                        </TableCell>

                                        <TableCell className="px-5 py-4 align-middle">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => baixarNota(item.numero)}
                                                aria-label={`Baixar nota ${item.numero}`}
                                            >
                                                <ArrowDownToLine className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                    Exibindo {notasFiltradas.length} de {notas.length} notas fiscais
                    {selectedMonth !== "todos" ? ` em ${labelPeriodo}` : ""}
                </span>
                <span>Formatos disponíveis: PDF e XML</span>
            </div>
        </div>
    );
}

export default NotasFiscais;