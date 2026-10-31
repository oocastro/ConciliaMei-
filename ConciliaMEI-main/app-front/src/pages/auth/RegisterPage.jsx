import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, FileText, LockKeyhole, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout, { AuthDivider, AuthField, AuthNotice, GoogleButton } from '../../components/layout/AuthLayout';
import { register } from '../../api/authApi';

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [notice, setNotice] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setErro(null);
        setCarregando(true);

        try {
            const {name: nomeSalvo, token } = await register (name, email, password);
            localStorage.setItem("token", token);
            localStorage.setItem("name", nomeSalvo);
            navigate("/dashboard");
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <AuthLayout
            title="Crie sua conta"
            description={<>Preencha os dados abaixo para começar a usar<br className="desktop-break" /> o ConciliaNFe e ter mais controle sobre seu financeiro.</>}
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                {/* Campo de Usuario */}
                <AuthField 
                    id="register-name" 
                    label="Nome" icon={User} 
                    inputMode="text" 
                    placeholder="Nome" 
                    autoComplete="username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={carregando}
                    required 
                />
                {/* Campo de E-mail */}
                <AuthField 
                    id="register-email" 
                    label="E-mail" 
                    icon={Mail} 
                    type="email" 
                    placeholder="seu@email.com" 
                    autoComplete="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={carregando}
                    required 
                />
                {/* Campo de senha */}
                <AuthField
                    id="register-password"
                    label="Senha"
                    icon={LockKeyhole}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={carregando}
                    trailing={
                        <button 
                            className="password-toggle" 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            aria-label={
                                showPassword 
                                ? 'Ocultar senha' 
                                : 'Mostrar senha'
                            }
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    }
                />
                {erro && <p style={{ color: "red" }}>{erro}</p>}
                <AuthNotice>{notice}</AuthNotice>
                <button className="auth-button auth-button-primary" type="submit">Registrar <ArrowRight /></button>
            </form>
            <AuthDivider />
            <GoogleButton onClick={() => setNotice('O cadastro com Google ainda não está configurado.')}>Registrar com Google</GoogleButton>
            <Link className="auth-login-link" to="/auth/sign-up">Já tenho login</Link>
        </AuthLayout>
    );
}