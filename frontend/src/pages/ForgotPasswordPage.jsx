import { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout, { AuthField, AuthNotice } from '../components/AuthLayout';

export default function ForgotPasswordPage() {
    const [notice, setNotice] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        // Mensagem neutra de propósito: não revela se o e-mail existe ou não.
        setNotice('A recuperação de senha ainda não está conectada ao backend.');
    }

    return (
        <AuthLayout
            title="Esqueceu sua senha?"
            description={<>Informe o e-mail da sua conta e enviaremos<br className="desktop-break" /> um link para você criar uma nova senha.</>}
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <AuthField id="forgot-email" label="E-mail" icon={Mail} type="email" placeholder="seu@email.com" autoComplete="email" required />
                <AuthNotice>{notice}</AuthNotice>
                <button className="auth-button auth-button-primary" type="submit">Enviar link <ArrowRight /></button>
            </form>
            <Link className="auth-login-link" to="/login"><ArrowLeft size={14} /> Voltar para o login</Link>
        </AuthLayout>
    );
}