import { Link } from 'react-router-dom';
import DashboardPage from '../dashboard/DashboardPage';

function handleSectionLinkClick(event) {
    const target = document.getElementById(event.currentTarget.hash.slice(1));
    if (!target) return;

    event.preventDefault();
    window.history.pushState(null, '', event.currentTarget.hash);
    target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
}

export default function HeroSection() {
    return (
        <div className="hero-section" id="inicio">
            <header className="nav">
                <Link className="brand" to="/" aria-label="ConciliaMEI início">
                    <span className="brand-mark" aria-hidden="true"><i /><i /></span>
                    <span className="brand-copy">
                        <span className="brand-name">Concilia<span>MEI</span></span>
                        <span className="brand-tag">CONCILIAÇÃO SIMPLIFICADA</span>
                    </span>
                </Link>
                <div className="nav-actions">
                    <Link className="login" to="/auth/sign-up">Entrar</Link>
                    <Link className="btn btn-primary" to="/auth/signin">Começar agora <span className="arrow">→</span></Link>
                </div>
            </header>

            <main>
                <section className="hero" aria-labelledby="hero-title">
                    <div className="hero-inner">
                        <div className="copy">
                            <div className="eyebrow"><span className="eyebrow-dot" />Mais clareza para o seu negócio</div>
                            <h1 id="hero-title">Suas notas fiscais, <span>em sintonia.</span></h1>
                            <p className="lead">
                                Organize suas NFS-e e confira as informações com mais facilidade. O ConciliaMEI ajuda você a
                                acompanhar notas fiscais e comprovantes em um só lugar, sem complicar sua rotina.
                            </p>
                            <div className="ctas">
                                <Link className="btn btn-primary" to="/auth/signin">Conheça o ConciliaMEI <span className="arrow">→</span></Link>
                                <a className="btn btn-ghost" href="#como-funciona" onClick={handleSectionLinkClick}>Entenda como funciona</a>
                            </div>
                            <div className="trust">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M20 7 10 17l-5-5" />
                                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                                </svg>
                                <span>Feito para simplificar a conciliação de notas de quem empreende.</span>
                            </div>
                        </div>

                        <div className="preview-wrap" aria-label="Prévia do dashboard ConciliaMEI">
                            <div className="glow" />
                            <div className="dashboard-preview-frame" id="notas">
                                <DashboardPage preview />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="below" id="recursos" aria-label="Principais recursos">
                    <article className="feature">
                        <span className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <path d="M14 2v6h6M8 13h8M8 17h8" />
                            </svg>
                        </span>
                        <div><h3>Notas fiscais organizadas</h3><p>Tenha as informações das NFS-e mais fáceis de consultar.</p></div>
                    </article>
                    <article className="feature" id="como-funciona">
                        <span className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8" />
                                <path d="M21 3v5h-5M21 12a9 9 0 0 1-15.36 6.36L3 16" />
                                <path d="M3 21v-5h5" />
                            </svg>
                        </span>
                        <div><h3>Conciliação simplificada</h3><p>Confira informações e acompanhe o que ainda precisa de atenção.</p></div>
                    </article>
                    <article className="feature" id="comecar">
                        <span className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="4" y="3" width="16" height="18" rx="2" />
                                <path d="m8 12 2.5 2.5L16 9" />
                            </svg>
                        </span>
                        <div><h3>Comprovantes à mão</h3><p>Acesse a área de comprovantes junto das demais informações do sistema.</p></div>
                    </article>
                </section>
            </main>
        </div>
    );
}
