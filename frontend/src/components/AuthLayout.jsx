import { QrCode, ShieldCheck, WalletCards, Zap, CheckCircle2 } from 'lucide-react';
import '../AuthPages.css';

function Brand({ compact = false }) {
    return (
        <div className={`auth-brand${compact ? ' auth-brand-compact' : ''}`} aria-label="ConciliaNFe">
            <span className="brand-mark" aria-hidden="true"><i /><i /></span>
            <span className="brand-name">Concilia<span>NFe</span></span>
            {!compact && <span className="brand-tagline">Notas fiscais e pagamentos em um só lugar.</span>}
        </div>
    );
}

function AuthIllustration() {
    return (
        <div className="auth-illustration" aria-hidden="true">
            <div className="invoice-art">
                <strong>NFS-e</strong>
                <span className="invoice-line invoice-line-wide" />
                <span className="invoice-line" />
                <span className="invoice-line" />
                <span className="invoice-line invoice-line-short" />
                <span className="invoice-check"><CheckCircle2 /></span>
            </div>
            <div className="payment-art">
                <span className="payment-check"><CheckCircle2 /></span>
                <strong>Pagamento identificado</strong>
                <span /><span />
            </div>
            <div className="qr-art"><QrCode /></div>
            <div className="pix-art"><WalletCards /></div>
            <div className="coins-art"><span /><span /><span /></div>
        </div>
    );
}

export default function AuthLayout({ title, description, children }) {
    return (
        <main className="auth-page">
            <section className="auth-showcase" aria-label="ConciliaNFe">
                <div className="showcase-copy">
                    <Brand />
                    <h1>Mais <span>controle</span> para<br />o seu financeiro.</h1>
                    <p className="showcase-description">
                        Concilie automaticamente suas NFS-e com os pagamentos recebidos, reduza erros e tenha uma visão completa da sua operação fiscal e financeira.
                    </p>
                    <ul className="feature-list">
                        <li>
                            <span className="feature-icon feature-blue"><Zap /></span>
                            <span><strong>Integração com NFS-e</strong><small>Via Focus NFe</small></span>
                        </li>
                        <li>
                            <span className="feature-icon feature-teal"><WalletCards /></span>
                            <span><strong>Rastreamento de pagamentos</strong><small>Pix, comprovantes e extrato</small></span>
                        </li>
                        <li>
                            <span className="feature-icon feature-violet"><ShieldCheck /></span>
                            <span><strong>Conciliação inteligente</strong><small>Automática e com sugestão de correspondências</small></span>
                        </li>
                    </ul>
                </div>
                <AuthIllustration />
            </section>

            <section className="auth-panel">
                <div className="auth-card">
                    <Brand compact />
                    <header className="auth-heading">
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </header>
                    {children}
                    <footer className="auth-footer">
                        <span>ConciliaNFe · Sistema de Conciliação Financeira e Fiscal</span>
                        <small>v1.0.0</small>
                    </footer>
                </div>
            </section>
        </main>
    );
}

export function AuthField({ id, label, icon: Icon, type = 'text', trailing, ...inputProps }) {
    return (
        <label className="auth-field" htmlFor={id}>
            <span>{label}</span>
            <span className="auth-input-wrap">
                <Icon aria-hidden="true" />
                <input id={id} type={type} {...inputProps} />
                {trailing}
            </span>
        </label>
    );
}

export function GoogleButton({ children, onClick }) {
    return (
        <button className="auth-button auth-button-google" type="button" onClick={onClick}>
            <span className="google-g" aria-hidden="true">G</span>{children}
        </button>
    );
}

export function AuthDivider() {
    return <div className="auth-divider"><span>ou</span></div>;
}

export function AuthNotice({ children }) {
    return children ? <p className="auth-notice" role="status">{children}</p> : null;
}
