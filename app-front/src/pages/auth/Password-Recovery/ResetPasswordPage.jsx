import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout, { AuthField, AuthNotice } from "../../../components/layout/AuthLayout";
import { resetPassword } from "../../../api/authApi";

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [notice, setNotice] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget.elements;
        const password = form['reset-password'].value;
        const confirmation = form['reset-confirm'].value;

        if (!token) {
            setNotice('Link inválido ou expirado. Solicite um novo link de recuperação.');
            return;
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            setNotice(`A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
            return;
        }

        if (password !== confirmation) {
            setNotice('As senhas não são iguais.');
            return;
        }

        // A validação real do token (existência, expiração, uso único) é feita no servidor.
        setLoading(true);
        setNotice('');

        try {
            await resetPassword(token, password);
            setDone(true);
            setNotice('Senha redefinida com sucesso! Redirecionando para o login...');
            setTimeout(() => navigate('/auth/login', { replace: true }), 2000);
        } catch (err) {
            setNotice(err.message || 'Não foi possível redefinir a senha. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Crie uma nova senha"
            description={<>Escolha uma senha com pelo menos {MIN_PASSWORD_LENGTH} caracteres<br className="desktop-break" /> para voltar a acessar o ConciliaNFe.</>}
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <AuthField
                    id="reset-password"
                    label="Nova senha"
                    icon={LockKeyhole}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite a nova senha"
                    autoComplete="new-password"
                    maxLength={72}
                    required
                    trailing={<button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff /> : <Eye />}</button>}
                />
                <AuthField
                    id="reset-confirm"
                    label="Confirmar nova senha"
                    icon={LockKeyhole}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repita a nova senha"
                    autoComplete="new-password"
                    maxLength={72}
                    required
                    trailing={<button className="password-toggle" type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}>{showConfirm ? <EyeOff /> : <Eye />}</button>}
                />
                <AuthNotice type={done ? 'success' : 'error'}>{notice}</AuthNotice>
                <button className="auth-button auth-button-primary" type="submit" disabled={loading || done}>{loading ? 'Salvando...' : 'Salvar nova senha'} <ArrowRight /></button>
            </form>
            <div className="mt-1 flex w-full justify-center">
                <Link
                    className="auth-login-link inline-flex! w-auto! flex-row items-center gap-1.5 whitespace-nowrap"
                    to="/auth/login"
                >
                    <ArrowLeft
                        size={14}
                        className="shrink-0"
                    />
                    <span className="whitespace-nowrap">
                        Voltar para o login
                    </span>
                </Link>
            </div>
        </AuthLayout>
    );
}