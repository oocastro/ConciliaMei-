import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Building2, Eye, EyeOff, LogOut, Plug, Scale, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import LGPDTermsButton from "@/components/LGPDTermsButton";
import { getMyCompany, SessionExpiredError } from "@/api/companyApi";
import { formatCnpj } from "@/lib/cnpj";
import { cn } from "@/lib/utils";

const SECTIONS = [
    { id: "conta", label: "Conta", icon: User },
    { id: "empresa", label: "Empresa", icon: Building2 },
    { id: "integracoes", label: "Integrações", icon: Plug },
    { id: "conciliacao", label: "Conciliação", icon: Scale },
    { id: "notificacoes", label: "Notificações", icon: Bell },
];

const INITIAL = {
    focusAmbiente: "homologacao",
    focusToken: "",
    pixProvedor: "efi",
    pixChave: "",
    toleranciaValor: "0,00",
    janelaDias: "5",
    autoConfirmarQr: true,
    sugerirConciliacao: true,
    notifComprovante: true,
    notifSugestao: true,
    notifRejeitada: true,
    notifResumo: false,
    senhaAtual: "",
    senhaNova: "",
    senhaConfirmar: "",
};

function Field({ id, label, hint, children }) {
    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
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

function SelectField({ id, value, onChange, options }) {
    return (
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    );
}

function SecretInput({ id, value, onChange, placeholder }) {
    const [visible, setVisible] = useState(false);
    return (
        <div className="relative">
            <Input
                id={id}
                type={visible ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete="off"
                className="pr-10"
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Ocultar" : "Mostrar"}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
            >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
}

function SectionCard({ title, description, children }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function CompanyData({ company, loading, error }) {
    if (loading) return <p className="text-sm text-muted-foreground">Carregando dados da empresa...</p>;
    if (error) return <p className="text-sm text-destructive">{error}</p>;
    if (!company) {
        return (
            <p className="text-sm text-muted-foreground">
                Nenhuma empresa cadastrada ainda. Cadastre o CNPJ para emitir e conciliar notas.
            </p>
        );
    }

    const rows = [
        ["CNPJ", formatCnpj(company.cnpj)],
        ["Razão social", company.razaoSocial],
        ["Nome fantasia", company.nomeFantasia],
        ["Atividade principal", company.atividadePrincipal],
    ];

    return (
        <dl className="grid max-w-xl gap-4">
            {rows.map(([label, value]) => (
                <div key={label} className="grid gap-0.5 border-b pb-3 last:border-0 last:pb-0">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-medium">{value || "—"}</dd>
                </div>
            ))}
        </dl>
    );
}

export default function SettingsPage() {
    const navigate = useNavigate();
    const [active, setActive] = useState("conta");
    const [form, setForm] = useState(INITIAL);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const [company, setCompany] = useState(null);
    const [companyLoading, setCompanyLoading] = useState(true);
    const [companyError, setCompanyError] = useState("");

    const userName = localStorage.getItem("name");

    useEffect(() => {
        let cancelled = false;

        getMyCompany()
            .then((data) => !cancelled && setCompany(data))
            .catch((err) => {
                if (cancelled) return;
                if (err instanceof SessionExpiredError) {
                    navigate("/auth/sign-up", { replace: true });
                    return;
                }
                setCompanyError(err.message);
            })
            .finally(() => !cancelled && setCompanyLoading(false));

        return () => {
            cancelled = true;
        };
    }, [navigate]);

    const set = (key) => (value) => {
        setForm((f) => ({ ...f, [key]: value }));
        setSaved(false);
        setError("");
    };
    const bind = (key) => ({ value: form[key], onChange: (e) => set(key)(e.target.value) });

    function handleSave(e) {
        e.preventDefault();

        if (form.senhaNova || form.senhaConfirmar) {
            if (form.senhaNova.length < 8) {
                setActive("conta");
                setError("A nova senha precisa ter pelo menos 8 caracteres.");
                return;
            }
            if (form.senhaNova !== form.senhaConfirmar) {
                setActive("conta");
                setError("As senhas não coincidem. Digite a mesma senha nos dois campos.");
                return;
            }
        }

        // TODO: enviar ao backend quando os endpoints de configurações existirem
        // (preferências, integrações e troca de senha). Hoje só valida e confirma na tela.
        setSaved(true);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        navigate("/auth/sign-up", { replace: true });
    }

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
                <p className="text-sm text-muted-foreground">
                    Conta, integrações e regras de conciliação.
                </p>
            </header>

            <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-[220px_1fr]">
                <nav
                    aria-label="Seções de configuração"
                    className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible"
                >
                    {SECTIONS.map(({ id, label, icon: Icon }) => {
                        const isActive = active === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setActive(id)}
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
                                <div className="grid max-w-md gap-5">
                                    <div className="grid gap-0.5">
                                        <span className="text-xs text-muted-foreground">Nome</span>
                                        <span className="text-sm font-medium">{userName || "—"}</span>
                                    </div>
                                    <Field id="senhaAtual" label="Senha atual">
                                        <Input
                                            id="senhaAtual"
                                            type="password"
                                            autoComplete="current-password"
                                            {...bind("senhaAtual")}
                                        />
                                    </Field>
                                    <Field id="senhaNova" label="Nova senha" hint="Mínimo de 8 caracteres.">
                                        <Input
                                            id="senhaNova"
                                            type="password"
                                            autoComplete="new-password"
                                            {...bind("senhaNova")}
                                        />
                                    </Field>
                                    <Field id="senhaConfirmar" label="Confirmar nova senha">
                                        <Input
                                            id="senhaConfirmar"
                                            type="password"
                                            autoComplete="new-password"
                                            {...bind("senhaConfirmar")}
                                        />
                                    </Field>
                                    {error && (
                                        <p role="alert" className="text-sm font-medium text-destructive">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            </SectionCard>

                            <Card>
                                <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Sair da conta</p>
                                        <p className="text-sm text-muted-foreground">
                                            Encerra a sessão neste navegador.
                                        </p>
                                    </div>
                                    <Button type="button" variant="outline" onClick={handleLogout}>
                                        <LogOut />
                                        Sair
                                    </Button>
                                </CardContent>
                                <LGPDTermsButton />
                            </Card>
                        </>
                    )}

                    {active === "empresa" && (
                        <SectionCard
                            title="Empresa"
                            description="Dados oficiais encontrados a partir do CNPJ cadastrado."
                        >
                            <CompanyData company={company} loading={companyLoading} error={companyError} />
                        </SectionCard>
                    )}

                    {active === "integracoes" && (
                        <SectionCard
                            title="Integrações"
                            description="Conecte o emissor de notas e o provedor de Pix."
                        >
                            <div className="grid max-w-md gap-8">
                                <div className="grid gap-5">
                                    <h3 className="text-sm font-semibold">Focus NFe</h3>
                                    <Field
                                        id="focusAmbiente"
                                        label="Ambiente"
                                        hint="Use homologação para testar sem emitir notas reais."
                                    >
                                        <SelectField
                                            id="focusAmbiente"
                                            value={form.focusAmbiente}
                                            onChange={set("focusAmbiente")}
                                            options={[
                                                { value: "homologacao", label: "Homologação" },
                                                { value: "producao", label: "Produção" },
                                            ]}
                                        />
                                    </Field>
                                    <Field id="focusToken" label="Token de acesso">
                                        <SecretInput
                                            id="focusToken"
                                            value={form.focusToken}
                                            onChange={set("focusToken")}
                                            placeholder="Cole o token da Focus NFe"
                                        />
                                    </Field>
                                </div>

                                <div className="grid gap-5 border-t pt-8">
                                    <h3 className="text-sm font-semibold">Provedor de Pix</h3>
                                    <Field id="pixProvedor" label="Provedor">
                                        <SelectField
                                            id="pixProvedor"
                                            value={form.pixProvedor}
                                            onChange={set("pixProvedor")}
                                            options={[
                                                { value: "efi", label: "Efí" },
                                                { value: "asaas", label: "Asaas" },
                                            ]}
                                        />
                                    </Field>
                                    <Field
                                        id="pixChave"
                                        label="Chave de API"
                                        hint="Usada para gerar QR Codes dinâmicos e consultar o extrato."
                                    >
                                        <SecretInput
                                            id="pixChave"
                                            value={form.pixChave}
                                            onChange={set("pixChave")}
                                            placeholder="Cole a chave de API"
                                        />
                                    </Field>
                                </div>
                            </div>
                        </SectionCard>
                    )}

                    {active === "conciliacao" && (
                        <SectionCard
                            title="Conciliação"
                            description="Regras para ligar notas fiscais aos pagamentos recebidos."
                        >
                            <div className="max-w-lg">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Field
                                        id="toleranciaValor"
                                        label="Tolerância de valor (R$)"
                                        hint="Diferença aceita entre a nota e o pagamento."
                                    >
                                        <Input id="toleranciaValor" inputMode="decimal" {...bind("toleranciaValor")} />
                                    </Field>
                                    <Field
                                        id="janelaDias"
                                        label="Janela de datas (dias)"
                                        hint="Quantos dias após a emissão buscar pagamentos."
                                    >
                                        <Input id="janelaDias" inputMode="numeric" {...bind("janelaDias")} />
                                    </Field>
                                </div>
                                <div className="mt-6 divide-y border-y">
                                    <ToggleRow
                                        title="Confirmar pagamentos via QR Code automaticamente"
                                        description="Quando o Pix pago tem o identificador da cobrança, a nota é confirmada sem revisão."
                                        checked={form.autoConfirmarQr}
                                        onChange={set("autoConfirmarQr")}
                                    />
                                    <ToggleRow
                                        title="Sugerir conciliações por valor e data"
                                        description="Pagamentos sem identificador viram sugestões que você confirma antes de baixar a nota."
                                        checked={form.sugerirConciliacao}
                                        onChange={set("sugerirConciliacao")}
                                    />
                                </div>
                                <p className="mt-4 text-xs text-muted-foreground">
                                    Comprovantes enviados manualmente sempre passam por análise antes de confirmar a nota.
                                </p>
                            </div>
                        </SectionCard>
                    )}

                    {active === "notificacoes" && (
                        <SectionCard title="Notificações" description="Escolha o que chega por e-mail.">
                            <div className="max-w-lg divide-y border-y">
                                <ToggleRow
                                    title="Comprovante em análise"
                                    description="Quando um cliente envia um comprovante de pagamento."
                                    checked={form.notifComprovante}
                                    onChange={set("notifComprovante")}
                                />
                                <ToggleRow
                                    title="Sugestão de conciliação"
                                    description="Quando há um pagamento esperando a sua confirmação."
                                    checked={form.notifSugestao}
                                    onChange={set("notifSugestao")}
                                />
                                <ToggleRow
                                    title="Nota rejeitada"
                                    description="Quando uma nota é recusada ou rejeitada na conciliação."
                                    checked={form.notifRejeitada}
                                    onChange={set("notifRejeitada")}
                                />
                                <ToggleRow
                                    title="Resumo semanal"
                                    description="Notas emitidas, valor em aberto e pendências da semana."
                                    checked={form.notifResumo}
                                    onChange={set("notifResumo")}
                                />
                            </div>
                        </SectionCard>
                    )}

                    {active !== "empresa" && (
                        <div className="flex items-center justify-end gap-4">
                            {saved && (
                                <span role="status" className="text-sm text-muted-foreground">
                                    Alterações salvas
                                </span>
                            )}
                            <Button type="submit">Salvar alterações</Button>
                        </div>
                    )}
                </div>
            </form>
        </main>
    );
}