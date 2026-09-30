import { useEffect, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

/*
 * Dados vêm do usuário logado (API). Formatos esperados:
 *
 * user:       { name, cnpj }
 * summary:    { totalIssued, openAmount, reconciledCount, pendingActionCount }
 * notes:      [{ id, number, client, cnpj, issuedAt }]   // a mais recente primeiro
 * pendencies: [{
 *   id, number, client, value, status: "em_analise" | "divergente" | "parcialmente_paga",
 *   pendingReason,
 *   payment: null | {
 *     situation, receivedAmount, method, paidAt,
 *     paidTo: { name, document },   // quem recebeu
 *     paidBy: { name, document },   // quem pagou
 *   }
 * }]
 */

const STATUS_LABELS = {
    em_analise: "Em análise",
    parcialmente_paga: "Parcialmente paga",
    divergente: "Divergente",
};

const EMPTY_SUMMARY = {
    totalIssued: 0,
    openAmount: 0,
    reconciledCount: 0,
    pendingActionCount: 0,
};

function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value ?? 0);
}

function formatDate(iso) {
    return format(parseISO(iso), "dd/MM/yyyy", { locale: ptBR });
}

// Preto e branco: "divergente" é a única pílula preenchida.
function StatusBadge({ status }) {
    return (
        <Badge
            variant="outline"
            className={
                status === "divergente"
                    ? "border-foreground bg-foreground text-background hover:bg-foreground"
                    : "border-foreground text-foreground"
            }
        >
            {STATUS_LABELS[status] ?? status}
        </Badge>
    );
}

function Stat({ title, value, description, icon: Icon }) {
    return (
        <div className="flex items-center gap-3.5 lg:px-5 lg:first:pl-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-muted-foreground">{title}</p>
                <p className="whitespace-nowrap text-2xl font-extrabold tracking-tight">{value}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

function DetailRow({ label, value, sub }) {
    return (
        <div className="grid grid-cols-[120px_1fr] gap-3 py-3 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-bold wrap-break-word">
                {value}
                {sub && <span className="block text-xs font-medium text-muted-foreground">{sub}</span>}
            </dd>
        </div>
    );
}

// Pop-up com o <dialog> nativo do navegador: Esc, foco e fundo escurecido já vêm prontos.
function PaymentDialog({ pendency, onClose }) {
    const ref = useRef(null);
    const payment = pendency?.payment;

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (pendency && !dialog.open) dialog.showModal();
        if (!pendency && dialog.open) dialog.close();
    }, [pendency]);

    return (
        <dialog
            ref={ref}
            onClose={onClose}
            onClick={(e) => e.target === ref.current && ref.current.close()}
            aria-labelledby="payment-title"
            className="m-auto w-[calc(100%-1.5rem)] max-w-md rounded-2xl border bg-background p-6 text-foreground shadow-2xl backdrop:bg-black/45"
        >
            {pendency && (
                <>
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                            <h2 id="payment-title" className="text-lg font-extrabold">
                                NFS-e {pendency.number}
                            </h2>
                            <StatusBadge status={pendency.status} />
                        </div>
                        <button
                            type="button"
                            onClick={() => ref.current.close()}
                            aria-label="Fechar"
                            className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <dl className="mt-2 divide-y">
                        <DetailRow label="Valor da nota" value={formatCurrency(pendency.value)} />
                        {!payment ? (
                            <DetailRow label="Pagamento" value="Nenhum pagamento identificado" />
                        ) : (
                            <>
                                <DetailRow label="Situação" value={payment.situation} />
                                <DetailRow
                                    label="Pago para"
                                    value={payment.paidTo.name}
                                    sub={payment.paidTo.document}
                                />
                                <DetailRow
                                    label="Pago por"
                                    value={payment.paidBy.name}
                                    sub={payment.paidBy.document}
                                />
                                <DetailRow label="Valor recebido" value={formatCurrency(payment.receivedAmount)} />
                                {payment.receivedAmount < pendency.value && (
                                    <DetailRow
                                        label="Falta receber"
                                        value={formatCurrency(pendency.value - payment.receivedAmount)}
                                    />
                                )}
                                <DetailRow label="Forma" value={payment.method} />
                                <DetailRow label="Data" value={formatDate(payment.paidAt)} />
                            </>
                        )}
                    </dl>
                </>
            )}
        </dialog>
    );
}

function Dashboard({ user, summary = EMPTY_SUMMARY, notes = [], pendencies = [] }) {
    const [selected, setSelected] = useState(null);

    const firstName = user?.name?.trim()?.split(" ")[0];
    const period = format(new Date(), "MMMM/yyyy", { locale: ptBR });

    return (
        <div className="space-y-4">
            <Card className="rounded-2xl">
                <CardHeader>
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        {firstName ? `Olá, ${firstName}` : "Olá"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Acompanhe suas NFS-e e recebimentos de {period}.
                    </p>
                </CardHeader>
            </Card>

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg font-extrabold">Visão geral</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x">
                    <Stat
                        title="Notas emitidas"
                        value={String(summary.totalIssued)}
                        description="No período"
                        icon={FileText}
                    />
                    <Stat
                        title="Valor em aberto"
                        value={formatCurrency(summary.openAmount)}
                        description="Pendentes, parciais ou divergentes"
                        icon={AlertCircle}
                    />
                    <Stat
                        title="Conciliadas"
                        value={String(summary.reconciledCount)}
                        description="Com pagamento confirmado"
                        icon={CheckCircle2}
                    />
                    <Stat
                        title="Pendentes de ação"
                        value={String(summary.pendingActionCount)}
                        description="Requerem conferência"
                        icon={Clock}
                    />
                </CardContent>
            </Card>

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg font-extrabold">
                        Pendências que precisam de atenção
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {pendencies.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            Nenhuma pendência. Tudo em dia.
                        </p>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {pendencies.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-1.5 rounded-xl border border-l-[3px] border-l-foreground p-4"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold">NFS-e {item.number}</span>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    <p className="text-sm font-semibold">{item.client}</p>
                                    <p className="text-sm text-muted-foreground">{item.pendingReason}</p>
                                    <div className="mt-auto flex items-center justify-between pt-2">
                                        <span className="font-bold">{formatCurrency(item.value)}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5 font-bold"
                                            onClick={() => setSelected(item)}
                                        >
                                            Revisar
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg font-extrabold">Notas mais recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted hover:bg-muted">
                                    <TableHead>Número</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Data de emissão</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                            Nenhuma nota emitida ainda. As notas novas aparecem aqui.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    notes.map((note) => (
                                        <TableRow key={note.id}>
                                            <TableCell className="font-bold tabular-nums">{note.number}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="max-w-64 truncate" title={note.client}>
                                                        {note.client}
                                                    </span>
                                                    {note.cnpj && (
                                                        <span className="text-xs text-muted-foreground">{note.cnpj}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatDate(note.issuedAt)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <PaymentDialog pendency={selected} onClose={() => setSelected(null)} />
        </div>
    );
}

export default Dashboard;