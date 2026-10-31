import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout, { AuthNotice } from "../../components/AuthLayout";
import { registerCompany, SessionExpiredError } from "../../api/companyApi";
import { formatCnpj } from "../../lib/cnpj";

// Passo 2 do cadastro da empresa: o usuário confere os dados encontrados e confirma.
export default function CompanyConfirmation() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const company = state?.company;

    if (!localStorage.getItem("token")) {
        return <Navigate to="/auth/login" replace />;
    }

    // Quem recarrega a página ou chega direto aqui perde os dados da consulta.
    if (!company) {
        return <Navigate to="/auth/register-company" replace />;
    }

    async function handleConfirm() {
        setError("");
        setSaving(true);

        try {
            // Só o CNPJ vai para o backend: ele consulta de novo e salva os dados oficiais.
            await registerCompany(company.cnpj);
            setDone(true);
        } catch (err) {
            if (err instanceof SessionExpiredError) {
                navigate("/auth/login", { replace: true });
                return;
            }
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (done) {
        return (
            <AuthLayout
                title="Empresa cadastrada com sucesso!"
                description="Tudo pronto. Agora você já pode usar o ConciliaNFe com a sua empresa."
            >
                <Link className="auth-button auth-button-primary" to="/dashboard">
                    Ir para o dashboard
                    <ArrowRight />
                </Link>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Confira os dados da sua empresa"
            description="Encontramos estes dados para o CNPJ informado. Eles estão corretos?"
        >
            <dl className="company-summary">
                <div>
                    <dt>CNPJ</dt>
                    <dd>{formatCnpj(company.cnpj)}</dd>
                </div>
                <div>
                    <dt>Razão social</dt>
                    <dd>{company.razaoSocial || "—"}</dd>
                </div>
                <div>
                    <dt>Nome fantasia</dt>
                    <dd>{company.nomeFantasia || "—"}</dd>
                </div>
                <div>
                    <dt>Atividade principal</dt>
                    <dd>{company.atividadePrincipal || "—"}</dd>
                </div>
                <div>
                    <dt>Situação</dt>
                    <dd>{company.situacaoCadastral || "—"}</dd>
                </div>
            </dl>

            <div className="auth-form">
                <AuthNotice>{error}</AuthNotice>

                <button
                    className="auth-button auth-button-primary"
                    type="button"
                    onClick={handleConfirm}
                    disabled={saving}
                >
                    {saving ? "Salvando..." : "Confirmar"}
                    {!saving && <ArrowRight />}
                </button>

                <Link
                    className="auth-button auth-button-secondary"
                    to="/auth/register-company"
                    aria-disabled={saving}
                >
                    Voltar
                </Link>
            </div>
        </AuthLayout>
    );
}
