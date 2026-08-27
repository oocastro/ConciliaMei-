import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Plus,
    ArrowRight,
    Building2,
    TrendingUp,
    RefreshCcw,
} from "lucide-react";

import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const STATUS_LABELS = {
    paga: "Paga",
    pendente: "Pendente",
    em_analise: "Em análise",
    parcialmente_paga: "Parcialmente paga",
    divergente: "Divergente",
};

const STATUS_VARIANTS = {
    paga: {
        badge: "bg-status-paid/15 text-status-paid border-status-paid/20 hover:bg-status-paid/20",
        icon: <CheckCircle2 className="h-4 w-4 text-status-paid" />,
    },
    pendente: {
        badge:
            "bg-status-pending/15 text-status-pending border-status-pending/20 hover:bg-status-pending/20",
        icon: <Clock className="h-4 w-4 text-status-pending" />,
    },
    em_analise: {
        badge:
            "bg-status-analysis/15 text-status-analysis border-status-analysis/20 hover:bg-status-analysis/20",
        icon: <RefreshCcw className="h-4 w-4 text-status-analysis" />,
    },
    parcialmente_paga: {
        badge:
            "bg-status-partial/15 text-status-partial border-status-partial/20 hover:bg-status-partial/20",
        icon: <TrendingUp className="h-4 w-4 text-status-partial" />,
    },
    divergente: {
        badge:
            "bg-status-discrepant/15 text-status-discrepant border-status-discrepant/20 hover:bg-status-discrepant/20",
        icon: <AlertTriangle className="h-4 w-4 text-status-discrepant" />,
    },
};

const MOCK_COMPANY = {
    name: "TechServiços Ltda.",
    cnpj: "12.345.678/0001-90",
    userName: "Mikael",
};

const MOCK_SUMMARY = {
    period: "Agosto/2026",
    totalIssued: 47,
    openAmount: 12450.0,
    reconciledCount: 31,
    pendingActionCount: 9,
};

const MOCK_NOTES = [
    {
        id: "1",
        number: "000124",
        client: "Construtora Horizonte S.A.",
        cnpj: "98.765.432/0001-10",
        value: 3200.0,
        issuedAt: "2026-08-24T10:00:00Z",
        status: "em_analise",
        pendingReason: "Comprovante enviado pelo tomador aguarda confirmação.",
    },
    {
        id: "2",
        number: "000123",
        client: "Consultoria ABC ME",
        cnpj: "11.222.333/0001-44",
        value: 1500.0,
        issuedAt: "2026-08-23T14:30:00Z",
        status: "paga",
    },
    {
        id: "3",
        number: "000122",
        client: "Auto Peças Sul",
        cnpj: "33.444.555/0001-66",
        value: 875.5,
        issuedAt: "2026-08-22T09:15:00Z",
        status: "divergente",
        pendingReason: "Valor recebido (R$ 800,00) é menor que o valor da nota.",
    },
    {
        id: "4",
        number: "000121",
        client: "Distribuidora Norte",
        cnpj: "55.666.777/0001-88",
        value: 4200.0,
        issuedAt: "2026-08-20T16:45:00Z",
        status: "pendente",
    },
    {
        id: "5",
        number: "000120",
        client: "Escritório Central",
        cnpj: "77.888.999/0001-22",
        value: 2100.0,
        issuedAt: "2026-08-19T11:20:00Z",
        status: "parcialmente_paga",
        pendingReason: "Recebido R$ 1.000,00. Aguardando complemento.",
    },
    {
        id: "6",
        number: "000119",
        client: "Logística Rápida Ltda.",
        cnpj: "99.000.111/0001-33",
        value: 2850.0,
        issuedAt: "2026-08-18T08:00:00Z",
        status: "em_analise",
        pendingReason: "Sugestão automática de conciliação com movimentação de extrato.",
        hasSuggestion: true,
    },
    {
        id: "7",
        number: "000118",
        client: "Gráfica Express",
        cnpj: "22.333.444/0001-55",
        value: 950.0,
        issuedAt: "2026-08-17T13:10:00Z",
        status: "paga",
    },
    {
        id: "8",
        number: "000117",
        client: "Farmácia Bem Estar",
        cnpj: "44.555.666/0001-77",
        value: 1750.0,
        issuedAt: "2026-08-15T17:00:00Z",
        status: "pendente",
    },
];

function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

function formatDate(iso) {
    return format(parseISO(iso), "dd/MM/yyyy", { locale: ptBR });
}

function StatusBadge({ status }) {
    const config = STATUS_VARIANTS[status];
    return (
        <Badge variant="outline" className={config.badge}>
            <span className="mr-1.5">{config.icon}</span>
            {STATUS_LABELS[status]}
        </Badge>
    );
}

function SummaryCard({ title, value, description, icon: Icon }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="rounded-md bg-muted p-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

function Dashboard() {
    const [activeTab, setActiveTab] = useState("todas");

    const filteredNotes = useMemo(() => {
        if (activeTab === "todas") return MOCK_NOTES;
        return MOCK_NOTES.filter((note) => note.status === activeTab);
    }, [activeTab]);

    const attentionNotes = useMemo(
        () =>
            MOCK_NOTES.filter(
                (note) =>
                    note.status === "em_analise" ||
                    note.status === "divergente" ||
                    note.status === "parcialmente_paga",
            ).slice(0, 3),
        [],
    );

    const tabCount = (key) =>
        key === "todas" ? MOCK_NOTES.length : MOCK_NOTES.filter((n) => n.status === key).length;

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                <span>{MOCK_COMPANY.name}</span>
                                <span className="text-border">•</span>
                                <span>CNPJ {MOCK_COMPANY.cnpj}</span>
                            </div>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                                Olá, {MOCK_COMPANY.userName}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Acompanhe suas NFS-e e recebimentos de {MOCK_SUMMARY.period.toLowerCase()}.
                            </p>
                        </div>
                        <Button className="w-full sm:w-auto">
                            <Plus className="h-4 w-4" />
                            Emitir nova NFS-e
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        title="Notas emitidas"
                        value={String(MOCK_SUMMARY.totalIssued)}
                        description={`No período de ${MOCK_SUMMARY.period}`}
                        icon={FileText}
                    />
                    <SummaryCard
                        title="Valor em aberto"
                        value={formatCurrency(MOCK_SUMMARY.openAmount)}
                        description="Notas pendentes, parciais ou divergentes"
                        icon={AlertCircle}
                    />
                    <SummaryCard
                        title="Conciliadas"
                        value={String(MOCK_SUMMARY.reconciledCount)}
                        description="Notas com pagamento confirmado"
                        icon={CheckCircle2}
                    />
                    <SummaryCard
                        title="Pendentes de ação"
                        value={String(MOCK_SUMMARY.pendingActionCount)}
                        description="Requerem conferência ou confirmação"
                        icon={Clock}
                    />
                </section>

                {attentionNotes.length > 0 && (
                    <section>
                        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
                            <AlertTriangle className="h-5 w-5 text-status-discrepant" />
                            Pendências que precisam de atenção
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {attentionNotes.map((note) => (
                                <Card key={note.id} className="border-l-4 border-l-status-analysis">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base">NFS-e {note.number}</CardTitle>
                                            <StatusBadge status={note.status} />
                                        </div>
                                        <CardDescription>{note.client}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="text-sm text-muted-foreground">{note.pendingReason}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{formatCurrency(note.value)}</span>
                                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-status-analysis">
                                                Revisar
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">
                            Notas mais recentes
                        </h2>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="h-8">
                                <TabsTrigger value="todas" className="text-xs">
                                    Todas ({tabCount("todas")})
                                </TabsTrigger>
                                <TabsTrigger value="paga" className="text-xs">
                                    Pagas ({tabCount("paga")})
                                </TabsTrigger>
                                <TabsTrigger value="pendente" className="text-xs">
                                    Pendentes ({tabCount("pendente")})
                                </TabsTrigger>
                                <TabsTrigger value="em_analise" className="text-xs">
                                    Em análise ({tabCount("em_analise")})
                                </TabsTrigger>
                                <TabsTrigger value="divergente" className="text-xs">
                                    Divergentes ({tabCount("divergente")})
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <Card>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-25">Número</TableHead>
                                        <TableHead className="w-25">Cliente</TableHead>
                                        <TableHead className="w-35">Valor</TableHead>
                                        <TableHead className="w-30">Emissão</TableHead>
                                        <TableHead className="w-35">Status</TableHead>
                                        <TableHead className="w-20"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredNotes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                Nenhuma nota encontrada para o filtro selecionado.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredNotes.map((note) => (
                                            <TableRow key={note.id}>
                                                <TableCell className="font-medium">{note.number}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="truncate max-w-50" title={note.client}>
                                                            {note.client}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">{note.cnpj}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatCurrency(note.value)}</TableCell>
                                                <TableCell>{formatDate(note.issuedAt)}</TableCell>
                                                <TableCell>
                                                    <StatusBadge status={note.status} />
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <ArrowRight className="h-4 w-4" />
                                                        <span className="sr-only">Abrir nota {note.number}</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </section>
            </main>
        </div>
    );
}

export default Dashboard
