import { useState } from "react";
import { ArrowRight, Building2 } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout, { AuthField, AuthNotice } from "../../components/layout/AuthLayout";
import { consultCnpj, SessionExpiredError } from "../../api/companyApi";
import { formatCnpj, isValidCnpj, onlyDigits } from "../../lib/cnpj";

// Passo 1 do cadastro da empresa: o usuário informa só o CNPJ.
// O sistema valida, consulta os dados e leva para a tela de confirmação.
export default function RegisterCompany() {
    const [cnpj, setCnpj] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    if (!localStorage.getItem("token")) {
        return <Navigate to="/auth/login" replace />;
    }

    function handleChange(event) {
        setCnpj(onlyDigits(event.target.value).slice(0, 14));
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        // Validação local: se estiver inválido, nem chamamos a API externa.
        if (!isValidCnpj(cnpj)) {
            setError("CNPJ inválido. Verifique os números informados.");
            return;
        }

        setLoading(true);

        try {
            const company = await consultCnpj(cnpj);
            navigate("/auth/register-company/confirm", { state: { company } });
        } catch (err) {
            if (err instanceof SessionExpiredError) {
                navigate("/auth/login", { replace: true });
                return;
            }
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Cadastre sua empresa"
            description={
                <>
                    Informe o CNPJ e buscaremos os dados
                    <br className="desktop-break" />
                    da sua empresa automaticamente.
                </>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <AuthField
                    id="company-cnpj"
                    label="CNPJ"
                    icon={Building2}
                    inputMode="numeric"
                    placeholder="00.000.000/0000-00"
                    autoComplete="off"
                    maxLength={18}
                    value={formatCnpj(cnpj)}
                    onChange={handleChange}
                    disabled={loading}
                    required
                />

                <AuthNotice>{error}</AuthNotice>

                <button
                    className="auth-button auth-button-primary"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Consultando CNPJ..." : "Continuar"}
                    {!loading && <ArrowRight />}
                </button>
            </form>

            <Link className="auth-login-link" to="/dashboard">
                Fazer isso depois
            </Link>
        </AuthLayout>
    );
}
