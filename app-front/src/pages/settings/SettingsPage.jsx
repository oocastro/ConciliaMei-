import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, Landmark, LogOut, Pencil, Plus, ShieldCheck, SlidersHorizontal, Tags, Trash2, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import LGPDTermsButton from "@/components/LGPDTermsButton";
import { cn } from "@/lib/utils";

/*
 * Sem dados e sem API: tudo chega por props, e nenhuma ação é simulada.
 * Botões cujo callback não foi passado ficam desabilitados.
 *
 * user: { name, email }
 * accounts: [{ id, institution, name, type: "corrente"|"poupanca"|"carteira"|"dinheiro", initialBalance, active }]
 * categories: [{ id, name, type: "income"|"expense" }]
 * preferences: { defaultPeriod: "month"|"30d"|"90d", hideValues: boolean }
 * Callbacks (async; se lançarem erro, a mensagem aparece na tela):
 *   onChangePassword({ current, next }), onAddAccount(), onEditAccount(account), onToggleAccount(account),
 *   onAddCategory(type), onEditCategory(category), onDeleteCategory(category),
 *   onSavePreferences(prefs), onRequestDeletion()
 * privacyUrl, termsUrl, appVersion: opcionais
 */

const SECTIONS = [
    { id: "conta", label: "Conta", icon: User },
    { id: "contas", label: "Contas financeiras", icon: Landmark },
    { id: "categorias", label: "Categorias", icon: Tags },
    { id: "preferencias", label: "Preferências", icon: SlidersHorizontal },
    { id: "privacidade", label: "Privacidade e segurança", icon: ShieldCheck },
    { id: "sobre", label: "Sobre", icon: Info },
];

const ACCOUNT_TYPES = { corrente: "Conta corrente", poupanca: "Poupança", carteira: "Carteira", dinheiro: "Dinheiro" };

const PERIODS = [
    { value: "month", label: "Mês atual" },
    { value: "30d", label: "Últimos 30 dias" },
    { value: "90d", label: "Últimos 90 dias" },
];

const brl = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v) || 0);

function Field({ id, label, hint, children }) {
    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className="text-sm font-medium">{label}</label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

function ToggleRow({ title, description, checked, onChange }) {
    return (
        <div className="flex items-start justify-between gap-6 py-4">
            <div className="max-w-md">
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
        </div>
    );
}

function SelectField({ id, value, onChange, options, disabled }) {
    return (
        <select
            id={id}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60"
        >
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    );
}

function SectionCard({ title, description, action, children }) {
    return (
        <Card>
            <CardHeader className={action ? "flex-row items-start justify-between gap-4 space-y-0" : undefined}>
                <div className="space-y-1.5">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                {action}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

const Empty = ({ children }) => <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>;

export default function SettingsPage({
    user, accounts = [], categories = [], preferences,
    onChangePassword, onAddAccount, onEditAccount, onToggleAccount,
    onAddCategory, onEditCategory, onDeleteCategory, onSavePreferences, onRequestDeletion,
    privacyUrl, termsUrl, appVersion,
}) {
    const navigate = useNavigate();
    const [active, setActive] = useState("conta");
    const [feedback, setFeedback] = useState({ ok: "", error: "" });
    const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
    const [prefs, setPrefs] = useState({ defaultPeriod: "month", hideValues: false, ...preferences });
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);

    const userName = user?.name || localStorage.getItem("name");

    // Só mostra "salvo" depois que a operação realmente terminou sem erro.
    async function run(fn, okMessage) {
        setFeedback({ ok: "", error: "" });
        try {
            await fn();
            if (okMessage) setFeedback({ ok: okMessage, error: "" });
            return true;
        } catch (err) {
            setFeedback({ ok: "", error: err?.message || "Não foi possível concluir a operação." });
            return false;
        }
    }

    function selectSection(id) {
        setActive(id);
        setFeedback({ ok: "", error: "" });
        setConfirmingDeletion(false);
    }

    async function handlePassword(e) {
        e.preventDefault();
        if (pwd.next.length < 8) return setFeedback({ ok: "", error: "A nova senha precisa ter pelo menos 8 caracteres." });
        if (pwd.next !== pwd.confirm) return setFeedback({ ok: "", error: "As senhas não coincidem. Digite a mesma senha nos dois campos." });
        const ok = await run(() => onChangePassword({ current: pwd.current, next: pwd.next }), "Senha alterada");
        if (ok) setPwd({ current: "", next: "", confirm: "" });
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        navigate("/auth/sign-up", { replace: true });
    }

    const bindPwd = (key) => ({
        value: pwd[key],
        onChange: (e) => { setPwd((p) => ({ ...p, [key]: e.target.value })); setFeedback({ ok: "", error: "" }); },
    });

    const Feedback = () => (
        <>
            {feedback.error && <p role="alert" className="text-sm font-medium text-destructive">{feedback.error}</p>}
            {feedback.ok && <p role="status" className="text-sm text-muted-foreground">{feedback.ok}</p>}
        </>
    );

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
                <p className="text-sm text-muted-foreground">Conta, contas financeiras, categorias e preferências.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                <nav aria-label="Seções de configuração" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
                    {SECTIONS.map(({ id, label, icon: Icon }) => {
                        const isActive = active === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => selectSection(id)}
                                aria-current={isActive ? "page" : undefined}
                                className={cn(
                                    "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-secondary text-secondary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        );
                    })}
                </nav>

                <div className="min-w-0 space-y-4">
                    {active === "conta" && (
                        <>
                            <SectionCard title="Conta" description="Seu acesso ao ConciliaMEI.">
                                <form onSubmit={handlePassword} className="grid max-w-md gap-5">
                                    <div className="grid gap-0.5">
                                        <span className="text-xs text-muted-foreground">Nome</span>
                                        <span className="text-sm font-medium">{userName || "—"}</span>
                                    </div>
                                    {user?.email && (
                                        <div className="grid gap-0.5">
                                            <span className="text-xs text-muted-foreground">E-mail</span>
                                            <span className="text-sm font-medium">{user.email}</span>
                                        </div>
                                    )}
                                    <Field id="senhaAtual" label="Senha atual">
                                        <Input id="senhaAtual" type="password" autoComplete="current-password" {...bindPwd("current")} />
                                    </Field>
                                    <Field id="senhaNova" label="Nova senha" hint="Mínimo de 8 caracteres.">
                                        <Input id="senhaNova" type="password" autoComplete="new-password" {...bindPwd("next")} />
                                    </Field>
                                    <Field id="senhaConfirmar" label="Confirmar nova senha">
                                        <Input id="senhaConfirmar" type="password" autoComplete="new-password" {...bindPwd("confirm")} />
                                    </Field>
                                    <Feedback />
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={!onChangePassword}>Salvar alterações</Button>
                                    </div>
                                </form>
                            </SectionCard>

                            <Card>
                                <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Sair da conta</p>
                                        <p className="text-sm text-muted-foreground">Encerra a sessão neste navegador.</p>
                                    </div>
                                    <Button type="button" variant="outline" onClick={handleLogout}>
                                        <LogOut />Sair
                                    </Button>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {active === "contas" && (
                        <SectionCard
                            title="Contas financeiras"
                            description="Contas usadas para importar extratos e organizar suas movimentações."
                            action={
                                <Button type="button" size="sm" disabled={!onAddAccount} onClick={() => run(onAddAccount)}>
                                    <Plus />Adicionar conta
                                </Button>
                            }
                        >
                            {accounts.length ? (
                                <ul className="divide-y border-y">
                                    {accounts.map((account) => (
                                        <li key={account.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">{account.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {account.institution} · {ACCOUNT_TYPES[account.type] || "Conta"}
                                                    {account.initialBalance != null && ` · Saldo inicial ${brl(account.initialBalance)}`}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="rounded-md text-[10px]">
                                                    {account.active ? "Ativa" : "Inativa"}
                                                </Badge>
                                                <Switch
                                                    checked={!!account.active}
                                                    disabled={!onToggleAccount}
                                                    onCheckedChange={() => run(() => onToggleAccount(account))}
                                                    aria-label={account.active ? "Desativar conta" : "Ativar conta"}
                                                />
                                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Editar"
                                                    disabled={!onEditAccount} onClick={() => run(() => onEditAccount(account))}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Empty>Nenhuma conta cadastrada. Adicione uma conta para importar seus extratos.</Empty>
                            )}
                            <div className="mt-3"><Feedback /></div>
                        </SectionCard>
                    )}

                    {active === "categorias" && (
                        <SectionCard title="Categorias" description="Organize suas receitas e despesas.">
                            <div className="grid gap-8">
                                {[["income", "Receitas"], ["expense", "Despesas"]].map(([type, title]) => {
                                    const list = categories.filter((c) => c.type === type);
                                    return (
                                        <div key={type}>
                                            <div className="mb-2 flex items-center justify-between">
                                                <h3 className="text-sm font-semibold">{title}</h3>
                                                <Button type="button" size="sm" variant="outline" disabled={!onAddCategory}
                                                    onClick={() => run(() => onAddCategory(type))}>
                                                    <Plus />Nova categoria
                                                </Button>
                                            </div>
                                            {list.length ? (
                                                <ul className="divide-y border-y">
                                                    {list.map((category) => (
                                                        <li key={category.id} className="flex items-center justify-between gap-3 py-3">
                                                            <div className="flex min-w-0 items-center gap-2">
                                                                <span className={cn("h-2 w-2 shrink-0 rounded-full", type === "income" ? "bg-status-paid" : "bg-status-discrepant")} />
                                                                <span className="truncate text-sm font-medium">{category.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Editar"
                                                                    disabled={!onEditCategory} onClick={() => run(() => onEditCategory(category))}>
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Excluir"
                                                                    disabled={!onDeleteCategory} onClick={() => run(() => onDeleteCategory(category), "Categoria excluída")}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <Empty>Nenhuma categoria de {title.toLowerCase()}.</Empty>
                                            )}
                                        </div>
                                    );
                                })}
                                <Feedback />
                            </div>
                        </SectionCard>
                    )}

                    {active === "preferencias" && (
                        <SectionCard title="Preferências" description="Como o ConciliaMEI exibe suas informações.">
                            <div className="grid max-w-md gap-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Field id="moeda" label="Moeda">
                                        <SelectField id="moeda" value="BRL" disabled onChange={() => {}} options={[{ value: "BRL", label: "Real brasileiro (BRL)" }]} />
                                    </Field>
                                    <Field id="formatoData" label="Formato de data">
                                        <SelectField id="formatoData" value="dmy" disabled onChange={() => {}} options={[{ value: "dmy", label: "DD/MM/AAAA" }]} />
                                    </Field>
                                </div>
                                <Field id="periodo" label="Período padrão do dashboard">
                                    <SelectField id="periodo" value={prefs.defaultPeriod} options={PERIODS}
                                        onChange={(v) => { setPrefs((p) => ({ ...p, defaultPeriod: v })); setFeedback({ ok: "", error: "" }); }} />
                                </Field>
                                <div className="divide-y border-y">
                                    <ToggleRow
                                        title="Ocultar valores financeiros"
                                        description="Esconde saldos e valores na tela até você querer vê-los."
                                        checked={prefs.hideValues}
                                        onChange={(v) => { setPrefs((p) => ({ ...p, hideValues: v })); setFeedback({ ok: "", error: "" }); }}
                                    />
                                </div>
                                <Feedback />
                                <div className="flex justify-end">
                                    <Button type="button" disabled={!onSavePreferences}
                                        onClick={() => run(() => onSavePreferences(prefs), "Preferências salvas")}>
                                        Salvar alterações
                                    </Button>
                                </div>
                            </div>
                        </SectionCard>
                    )}

                    {active === "privacidade" && (
                        <SectionCard title="Privacidade e segurança" description="Como seus dados são tratados.">
                            <div className="grid max-w-lg gap-5 text-sm">
                                <p>
                                    O ConciliaMEI <strong>não solicita nem armazena senhas bancárias</strong>. Os extratos são
                                    importados manualmente, nos formatos OFX e CSV.
                                </p>
                                <p className="text-muted-foreground">
                                    Guardamos apenas as informações financeiras que você cadastra ou importa: contas, movimentações
                                    e categorias. Elas ficam disponíveis somente para a sua conta.
                                </p>
                                <div className="border-t pt-5"><LGPDTermsButton /></div>
                                <div className="grid gap-3 border-t pt-5">
                                    <div>
                                        <p className="font-medium">Excluir conta e dados</p>
                                        <p className="text-muted-foreground">Solicita a exclusão da sua conta e de todos os dados financeiros.</p>
                                    </div>
                                    {confirmingDeletion ? (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button type="button" variant="destructive" disabled={!onRequestDeletion}
                                                onClick={() => run(onRequestDeletion, "Solicitação de exclusão enviada")}>
                                                Confirmar solicitação
                                            </Button>
                                            <Button type="button" variant="outline" onClick={() => setConfirmingDeletion(false)}>Cancelar</Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Button type="button" variant="outline" disabled={!onRequestDeletion} onClick={() => setConfirmingDeletion(true)}>
                                                <Trash2 />Solicitar exclusão
                                            </Button>
                                        </div>
                                    )}
                                    <Feedback />
                                </div>
                            </div>
                        </SectionCard>
                    )}

                    {active === "sobre" && (
                        <SectionCard title="Sobre o ConciliaMEI" description="Controle financeiro e conciliação bancária.">
                            <dl className="grid max-w-xl gap-4">
                                {[
                                    ["Sistema", "ConciliaMEI"],
                                    ["Versão", appVersion],
                                    ["Descrição", "Sistema de controle financeiro e conciliação bancária para MEIs, autônomos e pessoas físicas."],
                                ].filter(([, v]) => v).map(([label, value]) => (
                                    <div key={label} className="grid gap-0.5 border-b pb-3 last:border-0 last:pb-0">
                                        <dt className="text-xs text-muted-foreground">{label}</dt>
                                        <dd className="text-sm font-medium">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                            {(privacyUrl || termsUrl) && (
                                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                    {privacyUrl && <a href={privacyUrl} className="underline-offset-4 hover:underline">Aviso de Privacidade</a>}
                                    {termsUrl && <a href={termsUrl} className="underline-offset-4 hover:underline">Termos de Uso</a>}
                                </div>
                            )}
                        </SectionCard>
                    )}
                </div>
            </div>
        </main>
    );
}