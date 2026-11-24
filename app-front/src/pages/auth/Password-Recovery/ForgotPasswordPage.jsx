import { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout, { AuthField, AuthNotice } from "../../../components/layout/AuthLayout";
import { forgotPassword } from "../../../api/authApi";


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [notice, setNotice] = useState('');
    const [noticeType, setNoticeType] = useState('error');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);
        setNotice('');

        try {
            await forgotPassword(email);

            // Mensagem neutra de propósito: não revela se o e-mail existe ou não.
            setNoticeType('success');
            setNotice(
                'Se o e-mail estiver cadastrado, enviaremos um link para redefinir sua senha. Verifique sua caixa de entrada e a pasta de spam.'
            );
        } catch (err) {
            setNoticeType('error');
            setNotice(err.message || 'Não foi possível enviar o link. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Esqueceu sua senha?"
            description={
                <>
                    Informe o e-mail da sua conta e enviaremos
                    <br className="desktop-break" />
                    um link para você criar uma nova senha.
                </>
            }
        >
            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <AuthField
                    id="forgot-email"
                    label="E-mail"
                    icon={Mail}
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <button
                    className="auth-button auth-button-primary flex w-full items-center justify-center gap-2"
                    type="submit"
                    disabled={loading}
                >
                    <span>{loading ? 'Enviando...' : 'Enviar link'}</span>
                    <ArrowRight
                        size={16}
                        className="shrink-0"
                    />
                </button>

                {notice && (
                    <AuthNotice type={noticeType}>
                        {notice}
                    </AuthNotice>
                )}
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