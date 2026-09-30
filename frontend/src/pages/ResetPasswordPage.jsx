import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout, { AuthField, AuthNotice } from '../components/AuthLayout';

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [notice, setNotice] = useState('');

    function handleSubmit(event) {
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

        // TODO: enviar { token, password } para o backend.
        // A validação real do token (existência, expiração, uso único) é feita no servidor.
        setNotice('A redefinição de senha ainda não está conectada ao backend.');
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
                    required
                    trailing={<button className="password-toggle" type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}>{showConfirm ? <EyeOff /> : <Eye />}</button>}
                />
                <AuthNotice>{notice}</AuthNotice>
                <button className="auth-button auth-button-primary" type="submit">Salvar nova senha <ArrowRight /></button>
            </form>
            <Link className="auth-login-link" to="/login"><ArrowLeft size={14} /> Voltar para o login</Link>
        </AuthLayout>
    );
}