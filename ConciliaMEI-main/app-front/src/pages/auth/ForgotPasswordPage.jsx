import { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout, { AuthField, AuthNotice } from '../../components/layout/AuthLayout';


export default function ForgotPasswordPage() {
    const [notice, setNotice] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        // Mensagem neutra de propósito: não revela se o e-mail existe ou não.
        setNotice(
            'Se o e-mail estiver cadastrado, enviaremos um link para redefinir sua senha. Verifique sua caixa de entrada e a pasta de spam.'
        );
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
                    required
                />

                <button
                    className="auth-button auth-button-primary flex w-full items-center justify-center gap-2"
                    type="submit"
                >
                    <span>Enviar link</span>
                    <ArrowRight
                        size={16}
                        className="shrink-0"
                    />
                </button>

                {notice && (
                    <AuthNotice>
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
