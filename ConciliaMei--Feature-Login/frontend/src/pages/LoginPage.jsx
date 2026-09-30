import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRoundPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout, { AuthDivider, AuthField, AuthNotice, GoogleButton } from '../components/AuthLayout';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [notice, setNotice] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        setNotice('A autenticação ainda não está conectada ao backend.');
    }

    return (
        <AuthLayout
            title="Bem-vindo!"
            description={<>Acesse sua conta para continuar<br className="desktop-break" /> com a conciliação das suas notas fiscais.</>}
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <AuthField id="login-email" label="E-mail" icon={Mail} type="email" placeholder="seu@email.com" autoComplete="email" required />
                <AuthField
                    id="login-password"
                    label="Senha"
                    icon={LockKeyhole}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    required
                    trailing={<button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff /> : <Eye />}</button>}
                />
                <div className="auth-options">
                    <label className="remember-option"><input type="checkbox" defaultChecked /> <span>Lembrar de mim</span></label>
                    <button className="text-action" type="button" onClick={() => setNotice('A recuperação de senha ainda não está disponível.')}>Esqueceu sua senha?</button>
                </div>
                <AuthNotice>{notice}</AuthNotice>
                <button className="auth-button auth-button-primary" type="submit">Entrar <ArrowRight /></button>
            </form>
            <AuthDivider />
            <GoogleButton onClick={() => setNotice('O acesso com Google ainda não está configurado.')}>Entrar com Google</GoogleButton>
            <Link className="auth-button auth-button-primary auth-create-account" to="/register"><UserRoundPlus /> Criar conta</Link>
        </AuthLayout>
    );
}