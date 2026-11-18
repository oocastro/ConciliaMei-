import LGPDHeroNotice from "./LGPDHeroNotice";
import './HeroSection.css';
import { Link } from 'react-router-dom';
import {
    ArrowDownRight,
    ArrowUpRight,
    Check,
    CheckCircle2,
    CircleHelp,
    Clock3,
    FileSpreadsheet,
    FileText,
    GitCompareArrows,
    ScanSearch,
    ShieldCheck,
    Wallet,
    X,
} from 'lucide-react';

const processSteps = [
    {
        number: '01',
        icon: FileSpreadsheet,
        title: 'Importe seus extratos',
        description: 'Envie seus arquivos OFX ou CSV e reúna suas movimentações financeiras em um só lugar.',
    },
    {
        number: '02',
        icon: GitCompareArrows,
        title: 'Organize suas movimentações',
        description: 'Categorize receitas e despesas e confira sugestões de correspondência entre lançamentos.',
    },
    {
        number: '03',
        icon: ScanSearch,
        title: 'Acompanhe sua situação financeira',
        description: 'Visualize o que foi conciliado, identifique divergências e mantenha suas finanças organizadas.',
    },
];

const benefits = [
    {
        icon: Clock3,
        title: 'Menos trabalho manual',
        description: 'Facilite a conferência de movimentações e reduza tarefas repetitivas na sua rotina.',
    },
    {
        icon: FileSpreadsheet,
        title: 'Tudo mais organizado',
        description: 'Centralize contas, receitas, despesas e extratos em um único ambiente.',
    },
    {
        icon: ShieldCheck,
        title: 'Mais clareza e controle',
        description: 'Acompanhe seus registros financeiros e identifique o que precisa de atenção.',
    },
];

function ProductPreview() {
    return (
        <div
            className="cm-preview"
            aria-label="Prévia ilustrativa do controle financeiro e conciliação bancária"
        >
            <div className="cm-preview-topbar">
                <div className="cm-window-dots" aria-hidden="true">
                    <i /><i /><i />
                </div>
                <span>
                    CONCILIAMEI <span className="cm-preview-slash">/</span> FINANCEIRO
                </span>
                <span className="cm-preview-demo">DEMONSTRAÇÃO</span>
            </div>

            <div className="cm-preview-content">
                <div className="cm-preview-heading">
                    <div>
                        <span className="cm-preview-overline">VISÃO GERAL</span>
                        <h3>Controle financeiro</h3>
                        <p>Acompanhe suas receitas, despesas e movimentações.</p>
                    </div>
                    <span className="cm-preview-period">
                        Exemplo ilustrativo <ArrowDownRight size={13} />
                    </span>
                </div>

                <div className="cm-preview-metrics">
                    <div>
                        <span>Receitas</span>
                        <strong className="cm-metric-green">R$ 8.450</strong>
                        <small>no período</small>
                    </div>
                    <div>
                        <span>Despesas</span>
                        <strong>R$ 3.280</strong>
                        <small>no período</small>
                    </div>
                    <div>
                        <span>Saldo</span>
                        <strong>R$ 5.170</strong>
                        <small>resultado do período</small>
                    </div>
                </div>

                <div className="cm-preview-workflow">
                    <div className="cm-preview-workflow-head">
                        <span>EXEMPLO DE CONCILIAÇÃO</span>
                        <span className="cm-preview-status">
                            <CheckCircle2 size={13} /> Correspondência sugerida
                        </span>
                    </div>

                    <div className="cm-match-grid">
                        <div className="cm-match-card">
                            <div className="cm-match-icon">
                                <FileSpreadsheet size={17} />
                            </div>
                            <div className="cm-match-label">EXTRATO BANCÁRIO</div>
                            <strong>Transferência recebida</strong>
                            <span>Importado via OFX</span>
                            <b>R$ 1.250,00</b>
                        </div>

                        <div className="cm-match-connector" aria-hidden="true">
                            <span className="cm-connector-line" />
                            <span className="cm-connector-icon">
                                <GitCompareArrows size={16} />
                            </span>
                            <small>conferência</small>
                        </div>

                        <div className="cm-match-card">
                            <div className="cm-match-icon cm-match-icon-green">
                                <Wallet size={17} />
                            </div>
                            <div className="cm-match-label">MOVIMENTAÇÃO</div>
                            <strong>Receita registrada</strong>
                            <span>Registro financeiro</span>
                            <b>R$ 1.250,00</b>
                        </div>
                    </div>

                    <div className="cm-preview-result">
                        <span className="cm-result-check">
                            <Check size={14} />
                        </span>
                        <span>
                            <strong>Correspondência identificada</strong>
                            <small>Confira os dados e confirme a conciliação</small>
                        </span>
                        <span className="cm-result-badge">Revisar</span>
                    </div>

                </div>

                <div className="cm-preview-footnote">
                    <CircleHelp size={12} /> Interface demonstrativa com dados fictícios.
                </div>
            </div>
        </div>
    );
}

function BrandMark() {
    return (
        <span className="cm-brand-mark" aria-hidden="true">
            <i /><i />
        </span>
    );
}

export default function HeroSection() {
    return (
        <div className="cm-landing" id="home">
            <header className="cm-header">
                <div className="cm-container cm-header-inner">
                    <Link className="cm-brand" to="/" aria-label="ConciliaMEI - página inicial">
                        <BrandMark />
                        <span className="cm-brand-name">
                            Concilia<span>MEI</span>
                        </span>
                    </Link>

                    <nav className="cm-nav" aria-label="Navegação principal">
                        <a href="#home">Home</a>
                        <a href="#sobre">Sobre</a>
                        <a href="#vantagens">Vantagens</a>
                        <a href="#contato">Contato</a>
                    </nav>

                    <Link className="cm-button cm-button-small" to="/auth/signin">
                        Começar agora <ArrowUpRight size={15} />
                    </Link>
                </div>
            </header>

            <main>
                <section className="cm-hero">
                    <div className="cm-grid-texture" aria-hidden="true" />

                    <div className="cm-container cm-hero-layout">
                        <div className="cm-hero-copy">
                            <span className="cm-eyebrow">
                                <i /> CONTROLE FINANCEIRO E CONCILIAÇÃO BANCÁRIA
                            </span>

                            <h1>
                                Suas finanças em ordem, <em>em perfeita sintonia.</em>
                            </h1>

                            <p className="cm-hero-description">
                                O ConciliaMEI ajuda você a organizar receitas, despesas e contas
                                financeiras. Importe seus extratos bancários, confira suas
                                movimentações e tenha mais clareza sobre seu dinheiro.
                            </p>

                            <div className="cm-hero-actions">
                                <a className="cm-button cm-button-outline" href="#demonstracao">
                                    Ver demonstração <ArrowDownRight size={16} />
                                </a>

                                <Link className="cm-button cm-button-primary" to="/auth/signin">
                                    Começar agora <ArrowUpRight size={16} />
                                </Link>
                            </div>
                            <LGPDHeroNotice />

                            <div className="cm-hero-note">
                                <CheckCircle2 size={15} />
                                Mais organização e clareza para cuidar do seu dinheiro.
                            </div>
                        </div>

                        <div className="cm-hero-visual" id="demonstracao">
                            <div className="cm-visual-index">
                                <span>01 / 04</span>
                                <span>O sistema em funcionamento</span>
                            </div>

                            <ProductPreview />

                            <div className="cm-visual-caption">
                                <span>01</span> Uma visão clara das suas movimentações financeiras.
                            </div>
                        </div>
                    </div>

                    <div className="cm-hero-bottomline" />
                </section>

                <section className="cm-signal-strip" aria-label="Recursos do ConciliaMEI">
                    <div className="cm-container cm-signal-inner">
                        <p>SUAS FINANÇAS EM UM SÓ LUGAR</p>

                        <div className="cm-signal-items">
                            <span><Wallet size={17} /> Contas financeiras</span>
                            <i />
                            <span><FileSpreadsheet size={17} /> Extratos OFX e CSV</span>
                            <i />
                            <span><FileText size={17} /> Receitas e despesas</span>
                            <i />
                            <span><GitCompareArrows size={17} /> Conciliação bancária</span>
                        </div>
                    </div>
                </section>

                <section className="cm-about cm-section" id="sobre">
                    <div className="cm-container cm-about-layout">
                        <div className="cm-section-index">
                            <span>01</span><i /> SOBRE O CONCILIAMEI
                        </div>

                        <div className="cm-about-copy">
                            <h2>
                                Menos tempo organizando planilhas.{' '}
                                <em>Mais tempo cuidando das suas finanças.</em>
                            </h2>

                            <div className="cm-about-bottom">
                                <p>
                                    Controlar receitas, despesas e conferir extratos pode ser
                                    uma tarefa cansativa quando as informações estão espalhadas.
                                    O ConciliaMEI foi pensado para reunir suas movimentações
                                    financeiras em um único ambiente, facilitando a organização
                                    e a conferência do seu dinheiro.
                                </p>

                                <div className="cm-about-signature">
                                    <span className="cm-about-symbol">
                                        <GitCompareArrows size={21} />
                                    </span>
                                    <span>
                                        Do extrato à movimentação,
                                        <br />
                                        uma visão mais conectada.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cm-process cm-section" id="como-funciona">
                    <div className="cm-container">
                        <div className="cm-section-heading">
                            <div className="cm-section-index">
                                <span>02</span><i /> COMO FUNCIONA
                            </div>

                            <h2>
                                Um processo simples.
                                <br />
                                <em>Uma rotina mais organizada.</em>
                            </h2>

                            <p>
                                Importe, organize e confira suas movimentações financeiras
                                com mais praticidade.
                            </p>
                        </div>

                        <div className="cm-process-grid">
                            {processSteps.map(({ number, icon: Icon, title, description }) => (
                                <article className="cm-process-card" key={number}>
                                    <div className="cm-process-card-top">
                                        <span className="cm-line-icon">
                                            <Icon size={21} strokeWidth={1.5} />
                                        </span>
                                        <span>{number}</span>
                                    </div>

                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                    <div className="cm-process-card-line" />
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="cm-benefits cm-section" id="vantagens">
                    <div className="cm-container">
                        <div className="cm-benefits-heading">
                            <div>
                                <div className="cm-section-index">
                                    <span>03</span><i /> VANTAGENS
                                </div>

                                <h2>
                                    Clareza para conferir.
                                    <br />
                                    <em>Liberdade para avançar.</em>
                                </h2>
                            </div>

                            <p>
                                Uma ferramenta para transformar informações financeiras
                                dispersas em uma visão mais simples e organizada.
                            </p>
                        </div>

                        <div className="cm-benefits-grid">
                            {benefits.map(({ icon: Icon, title, description }, index) => (
                                <article className="cm-benefit" key={title}>
                                    <span className="cm-benefit-number">0{index + 1}</span>
                                    <Icon size={22} strokeWidth={1.5} />
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="cm-comparison cm-section">
                    <div className="cm-container">
                        <div className="cm-section-heading">
                            <div className="cm-section-index">
                                <span>04</span><i /> UMA NOVA FORMA DE ORGANIZAR
                            </div>

                            <h2>
                                Troque a conferência dispersa
                                <br />
                                <em>por uma visão conectada.</em>
                            </h2>
                        </div>

                        <div className="cm-comparison-grid">
                            <article className="cm-comparison-card cm-old-way">
                                <div className="cm-comparison-label">O JEITO ANTIGO</div>
                                <h3>Informações espalhadas.</h3>

                                <ul>
                                    <li><X size={16} /> Planilhas e anotações separadas</li>
                                    <li><X size={16} /> Conferência manual de cada lançamento</li>
                                    <li><X size={16} /> Dificuldade para localizar divergências</li>
                                    <li><X size={16} /> Pouca clareza sobre receitas e despesas</li>
                                </ul>
                            </article>

                            <article className="cm-comparison-card cm-new-way">
                                <div className="cm-comparison-label">COM O CONCILIAMEI</div>
                                <h3>Uma visão mais organizada.</h3>

                                <ul>
                                    <li><Check size={16} /> Contas e movimentações centralizadas</li>
                                    <li><Check size={16} /> Importação de extratos OFX e CSV</li>
                                    <li><Check size={16} /> Sugestões para facilitar a conciliação</li>
                                    <li><Check size={16} /> Acompanhamento de receitas e despesas</li>
                                </ul>
                            </article>
                        </div>

                        <p className="cm-comparison-note">
                            O ConciliaMEI auxilia na organização e na conferência das
                            movimentações. As sugestões de conciliação devem ser revisadas
                            pelo usuário antes da confirmação.
                        </p>
                    </div>
                </section>

                <section className="cm-contact" id="contato">
                    <div className="cm-grid-texture cm-grid-texture-dark" aria-hidden="true" />

                    <div className="cm-container cm-contact-inner">
                        <div className="cm-section-index">
                            <span>05</span><i /> PRÓXIMO PASSO
                        </div>

                        <h2>
                            Deixe o controle financeiro
                            <br />
                            <em>mais simples.</em>
                        </h2>

                        <p>
                            Organize suas contas, acompanhe suas movimentações e tenha
                            mais controle sobre sua vida financeira.
                        </p>

                        <Link className="cm-button cm-button-light" to="/auth/signin">
                            Começar agora <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="cm-footer">
                <div className="cm-container">
                    <div className="cm-footer-main">
                        <div className="cm-footer-brand">
                            <Link className="cm-brand" to="/">
                                <BrandMark />
                                <span className="cm-brand-name">
                                    Concilia<span>MEI</span>
                                </span>
                            </Link>

                            <p>
                                Controle financeiro e conciliação bancária
                                <br />
                                com mais clareza para sua rotina.
                            </p>
                        </div>

                        <div className="cm-footer-column">
                            <span>NAVEGAÇÃO</span>
                            <a href="#home">Home</a>
                            <a href="#sobre">Sobre</a>
                            <a href="#vantagens">Vantagens</a>
                            <a href="#contato">Contato</a>
                        </div>

                        <div className="cm-footer-column">
                            <span>ACESSO</span>
                            <Link to="/auth/signin">Entrar</Link>
                            <Link to="/auth/sign-up">Criar conta</Link>
                        </div>

                        <div className="cm-footer-column cm-footer-contact">
                            <span>FALE COM O SISTEMA</span>
                            <p>
                                Precisa acessar sua área ou começar a usar o ConciliaMEI?
                            </p>
                            <Link to="/auth/signin">
                                Acessar o ConciliaMEI <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <div className="cm-footer-bottom">
                        <span>
                            © {new Date().getFullYear()} ConciliaMEI. Todos os direitos reservados.
                        </span>
                        <span>Feito para simplificar seu controle financeiro.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
