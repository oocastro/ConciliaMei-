import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Wallet, TrendingUp, TrendingDown, ArrowDownLeft, ArrowRight, Upload, Plus,
  Landmark, CalendarDays, ShoppingBag, Car, House, HeartPulse, Utensils,
  CircleDollarSign, RefreshCcw, AlertCircle, CheckCircle2, Clock, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const STATUS = {
  conciliada: { label: "Conciliada", className: "bg-status-paid/15 text-status-paid border-status-paid/20", icon: CheckCircle2 },
  pendente: { label: "Pendente", className: "bg-status-pending/15 text-status-pending border-status-pending/20", icon: Clock },
  revisar: { label: "Revisar", className: "bg-status-analysis/15 text-status-analysis border-status-analysis/20", icon: RefreshCcw },
  duplicada: { label: "Possível duplicidade", className: "bg-status-discrepant/15 text-status-discrepant border-status-discrepant/20", icon: AlertTriangle },
};

const CATEGORY_ICONS = {
  Alimentação: Utensils, Transporte: Car, Moradia: House,
  Saúde: HeartPulse, Compras: ShoppingBag, Receitas: CircleDollarSign,
};

function currency(value) {
  if (value === null || value === undefined || value === "") return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);
}

function dateLabel(value) {
  if (!value) return "—";
  return format(typeof value === "string" ? parseISO(value) : new Date(value), "dd/MM/yyyy", { locale: ptBR });
}

function StatusBadge({ status }) {
  const config = STATUS[status] || STATUS.pendente;
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={`${config.className} gap-1 rounded-md px-1.5 py-0 text-[10px]`}>
      <Icon className="h-3 w-3" />{config.label}
    </Badge>
  );
}

function SummaryCard({ title, value, description, icon: Icon, trend, positive }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 sm:p-5 sm:pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">{title}</CardTitle>
        <div className="rounded-md bg-muted p-1.5 sm:p-2"><Icon className="h-4 w-4 text-muted-foreground" /></div>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-5 sm:pt-0">
        <div className="text-lg font-bold tracking-tight sm:text-2xl">{value}</div>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground sm:text-xs">
          {trend != null && <span className={positive ? "text-status-paid" : "text-status-discrepant"}>{trend}</span>}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function TransactionRow({ transaction, mobile = false }) {
  const income = transaction.type === "income";
  const Icon = CATEGORY_ICONS[transaction.category] || (income ? ArrowDownLeft : ShoppingBag);

  return (
    <div className={mobile ? "space-y-3 rounded-lg border p-3" : "contents"}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-md bg-muted p-2"><Icon className="h-4 w-4 text-muted-foreground" /></div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{transaction.description}</p>
          <p className="text-[11px] text-muted-foreground">
            {transaction.accountName || "Conta"} · {transaction.category || "Sem categoria"}
          </p>
        </div>
      </div>
      {mobile && (
        <div className="flex items-center justify-between border-t pt-2">
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">{dateLabel(transaction.date)}</p>
            <StatusBadge status={transaction.status} />
          </div>
          <span className={`text-sm font-semibold ${income ? "text-status-paid" : "text-foreground"}`}>
            {income ? "+" : "−"} {currency(transaction.amount)}
          </span>
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-3 rounded-full bg-muted p-3"><Wallet className="h-5 w-5 text-muted-foreground" /></div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function DashboardView({ data, onImport, onNewTransaction, onViewTransactions }) {
  const [activeTab, setActiveTab] = useState("all");
  const summary = data?.summary || {};
  const transactions = data?.recentTransactions || [];
  const categories = data?.expenseCategories || [];
  const cashflow = data?.cashflow || [];
  const accounts = data?.accounts || [];

  const filtered = useMemo(
    () => (activeTab === "all" ? transactions : transactions.filter((t) => t.type === activeTab)),
    [activeTab, transactions]
  );

  const maxCashflow = Math.max(1, ...cashflow.map((i) => Math.max(Number(i.income) || 0, Number(i.expenses) || 0)));
  const totalExpenses = categories.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Landmark className="h-4 w-4" />
              <span>{accounts.length > 1 ? "Todas as contas" : accounts[0]?.bankName || "Visão geral das suas contas"}</span>
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              Olá{summary.userName ? `, ${summary.userName}` : ""}!
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">Aqui está o resumo da sua vida financeira.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto" onClick={onNewTransaction}>
              <Plus className="h-4 w-4" />Nova movimentação
            </Button>
            <Button className="w-full sm:w-auto" onClick={onImport}>
              <Upload className="h-4 w-4" />Importar extrato
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
        <section className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          <SummaryCard title="Saldo total" value={currency(summary.totalBalance)} description="Somatório das contas" icon={Wallet} />
          <SummaryCard title="Receitas do mês" value={currency(summary.monthlyIncome)} description="Entradas no período" icon={TrendingUp} trend={summary.incomeChange} positive />
          <SummaryCard title="Despesas do mês" value={currency(summary.monthlyExpenses)} description="Saídas no período" icon={TrendingDown} trend={summary.expensesChange} positive={false} />
          <SummaryCard title="A conferir" value={summary.toReview ?? "—"} description="Movimentações pendentes" icon={AlertCircle} />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="p-4 sm:p-5">
              <CardTitle className="text-sm sm:text-base">Fluxo financeiro</CardTitle>
              <CardDescription className="text-xs">Entradas e saídas dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5">
              {cashflow.length ? (
                <div className="flex h-48 items-end justify-between gap-2 border-b pb-2 sm:gap-4">
                  {cashflow.map((item) => (
                    <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <div className="flex h-full w-full items-end justify-center gap-1">
                        <div title={`Receitas: ${currency(item.income)}`} className="w-3 rounded-t-sm bg-primary/80 sm:w-5" style={{ height: `${Math.max(2, ((Number(item.income) || 0) / maxCashflow) * 100)}%` }} />
                        <div title={`Despesas: ${currency(item.expenses)}`} className="w-3 rounded-t-sm bg-muted-foreground/40 sm:w-5" style={{ height: `${Math.max(2, ((Number(item.expenses) || 0) / maxCashflow) * 100)}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Sem dados de fluxo financeiro" description="Quando houver movimentações, você verá aqui a comparação entre receitas e despesas." />
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary/80" />Receitas</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-muted-foreground/40" />Despesas</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-5">
              <CardTitle className="text-sm sm:text-base">Despesas por categoria</CardTitle>
              <CardDescription className="text-xs">Distribuição dos gastos no mês</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 pb-4 sm:px-5 sm:pb-5">
              {categories.length ? categories.map((item) => {
                const percent = item.percentage != null
                  ? Number(item.percentage)
                  : totalExpenses ? ((Number(item.amount) || 0) / totalExpenses) * 100 : 0;
                return (
                  <div key={item.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                      <span className="truncate text-muted-foreground">{item.name}</span>
                      <span className="font-medium">{currency(item.amount)} · {percent.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, percent)}%` }} />
                    </div>
                  </div>
                );
              }) : (
                <EmptyState title="Nenhuma despesa categorizada" description="As categorias aparecerão aqui depois da importação e classificação das movimentações." />
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <CardTitle className="text-sm sm:text-base">Movimentações recentes</CardTitle>
                <CardDescription className="text-xs">Últimas entradas e saídas das suas contas</CardDescription>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                  <TabsTrigger value="income" className="text-xs">Receitas</TabsTrigger>
                  <TabsTrigger value="expense" className="text-xs">Despesas</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3 px-4 pb-4 md:hidden">
                {filtered.length ? filtered.slice(0, 6).map((item) => (
                  <TransactionRow key={item.id} transaction={item} mobile />
                )) : (
                  <EmptyState title="Nenhuma movimentação encontrada" description="Importe um extrato ou cadastre uma movimentação para começar." />
                )}
              </div>

              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length ? filtered.slice(0, 7).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell><TransactionRow transaction={item} /></TableCell>
                        <TableCell className="text-xs">{item.category || "Sem categoria"}</TableCell>
                        <TableCell className="text-xs">{dateLabel(item.date)}</TableCell>
                        <TableCell><StatusBadge status={item.status} /></TableCell>
                        <TableCell className={`text-right font-medium ${item.type === "income" ? "text-status-paid" : ""}`}>
                          {item.type === "income" ? "+" : "−"} {currency(item.amount)}
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <EmptyState title="Nenhuma movimentação encontrada" description="Importe um extrato ou cadastre uma movimentação para começar." />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="border-t px-4 py-3">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={onViewTransactions}>
                  Ver todas as movimentações<ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-5">
              <CardTitle className="text-sm sm:text-base">Minhas contas</CardTitle>
              <CardDescription className="text-xs">Resumo dos saldos cadastrados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4 sm:px-5 sm:pb-5">
              {accounts.length ? accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="rounded-md bg-muted p-2"><Landmark className="h-4 w-4 text-muted-foreground" /></div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{account.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{account.bankName}</p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {account.lastImportAt ? `Importado em ${dateLabel(account.lastImportAt)}` : "Sem importação"}
                      </p>
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-xs font-semibold">{currency(account.balance)}</span>
                </div>
              )) : (
                <EmptyState title="Nenhuma conta cadastrada" description="Cadastre uma conta ou importe seu primeiro extrato bancário." />
              )}
            </CardContent>
          </Card>
        </section>

        {summary.lastImportAt && (
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />Última importação: {dateLabel(summary.lastImportAt)}
          </p>
        )}
      </main>
    </div>
  );
}

// Sem dados e sem chamadas à API por enquanto: a dashboard renderiza os estados vazios.
// Quando for integrar, passe o objeto `data` (summary, cashflow, expenseCategories, accounts, recentTransactions).
export default function DashboardPage({ data, onImport, onNewTransaction, onViewTransactions }) {
  return (
    <DashboardView
      data={data}
      onImport={onImport}
      onNewTransaction={onNewTransaction}
      onViewTransactions={onViewTransactions}
    />
  );
}