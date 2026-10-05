import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, FileText, LockKeyhole, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout, { AuthDivider, AuthField, AuthNotice, GoogleButton } from '../components/AuthLayout';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [notice, setNotice] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        setNotice('O cadastro ainda não está conectado ao backend.');
    }

    return (
        <AuthLayout
            title="Crie sua conta"
            description={<>Preencha os dados abaixo para começar a usar<br className="desktop-break" /> o ConciliaNFe e ter mais controle sobre seu financeiro.</>}
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <AuthField id="register-email" label="E-mail" icon={Mail} type="email" placeholder="seu@email.com" autoComplete="email" required />
                <AuthField
                    id="register-password"
                    label="Senha"
                    icon={LockKeyhole}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    autoComplete="new-password"
                    required
                    trailing={<button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff /> : <Eye />}</button>}
                />
                <AuthField id="register-cnpj" label="CNPJ" icon={FileText} inputMode="numeric" placeholder="00.000.000/0000-00" autoComplete="off" required />
                <AuthNotice>{notice}</AuthNotice>
                <button className="auth-button auth-button-primary" type="submit">Registrar <ArrowRight /></button>
            </form>
            <AuthDivider />
            <GoogleButton onClick={() => setNotice('O cadastro com Google ainda não está configurado.')}>Registrar com Google</GoogleButton>
            <Link className="auth-login-link" to="/login">Já tenho login</Link>
        </AuthLayout>
    );
}