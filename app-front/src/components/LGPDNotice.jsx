import { ShieldCheck } from "lucide-react";

export const LGPD_NOTICE_VERSION = "1.0";
export const LGPD_NOTICE_UPDATED_AT = "16/11/2026";

function Section({ title, children }) {
    return (
        <section className="space-y-2">
            <h3 className="border-l-[3px] border-foreground pl-3 text-sm font-extrabold">{title}</h3>
            <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
        </section>
    );
}

function List({ items }) {
    return (
        <ul className="list-disc space-y-1 pl-5">
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    );
}

export function LGPDNoticeHeader({ children }) {
    return (
        <header className="flex items-center gap-3.5 border-b px-6 py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
                <h2 id="lgpd-title" className="text-lg font-extrabold leading-tight">
                    Privacidade e Proteção de Dados
                </h2>
                <p className="text-xs text-muted-foreground">
                    ConciliaMEI • Política de privacidade • v{LGPD_NOTICE_VERSION}
                </p>
            </div>
            {children}
        </header>
    );
}

const SECTIONS = [
    {
        title: "1. Quem é o responsável pelos dados?",
        content: (
            <>
                <p>
                    O ConciliaMEI é operado por <strong>[RAZÃO SOCIAL / NOME]</strong>, CNPJ{" "}
                    <strong>[CNPJ]</strong>, com contato em <strong>[E-MAIL DE PRIVACIDADE]</strong>.
                </p>
                <p className="mt-2">
                    Em relação aos dados da sua conta e do seu uso da plataforma, o ConciliaMEI atua como{" "}
                    <strong>controlador</strong>. Em relação aos dados dos seus clientes que você cadastra ou
                    importa (por exemplo, tomadores de serviço), você, MEI, é o controlador e o ConciliaMEI atua
                    como <strong>operador</strong>, tratando esses dados apenas conforme suas instruções e para
                    prestar o serviço.
                </p>
            </>
        ),
    },
    {
        title: "2. Quais dados são tratados?",
        content: (
            <List
                items={[
                    "Cadastro do MEI: nome, CPF, CNPJ, e-mail, telefone e dados da empresa.",
                    "Cadastro de clientes: nome, CPF ou CNPJ, e-mail e endereço, quando informados.",
                    "Notas fiscais de serviço (NFS-e): dados de emissão, valores, tomador e situação da nota.",
                    "Dados financeiros: cobranças Pix, pagamentos recebidos, movimentações e comprovantes enviados.",
                    "Dados de autenticação e segurança: credenciais, endereço IP, registros de acesso (logs) e dispositivo.",
                    "Dados de uso da plataforma, para suporte e melhoria do serviço.",
                ]}
            />
        ),
    },
    {
        title: "3. Para que usamos e em qual base legal?",
        content: (
            <List
                items={[
                    "Emitir e acompanhar NFS-e, gerar cobranças Pix e conciliar pagamentos: execução de contrato (art. 7º, V, LGPD).",
                    "Cumprir deveres fiscais, contábeis e regulatórios: obrigação legal (art. 7º, II).",
                    "Analisar comprovantes e identificar pagamentos correspondentes às notas: execução de contrato (art. 7º, V).",
                    "Segurança, prevenção a fraudes e proteção da conta: legítimo interesse (art. 7º, IX).",
                    "Defesa em processos judiciais, administrativos ou arbitrais: exercício regular de direitos (art. 7º, VI).",
                    "Comunicações opcionais, como novidades: consentimento (art. 7º, I), que pode ser revogado a qualquer momento.",
                ]}
            />
        ),
    },
    {
        title: "4. Com quem compartilhamos?",
        content: (
            <>
                <p>Compartilhamos dados somente na medida necessária para prestar o serviço, com:</p>
                <div className="mt-2">
                    <List
                        items={[
                            "Prefeitura e provedor de NFS-e: [NOME DO PROVEDOR], para emissão e consulta das notas.",
                            "Instituição de pagamento ou banco: [NOME DO PSP], para geração e confirmação de cobranças Pix.",
                            "Provedores de hospedagem e infraestrutura: [NOME / PAÍS].",
                            "[Se houver] Serviço de OCR/IA para leitura de comprovantes: [NOME / PAÍS].",
                            "Autoridades públicas, quando houver obrigação legal ou ordem judicial.",
                        ]}
                    />
                </div>
                <p className="mt-2">Não vendemos dados pessoais.</p>
            </>
        ),
    },
    {
        title: "5. Transferência internacional",
        content: (
            <p>
                Alguns provedores podem armazenar ou processar dados fora do Brasil. Quando isso ocorrer,
                adotamos as garantias previstas na LGPD (art. 33), como cláusulas contratuais adequadas ou
                provedores que assegurem nível de proteção compatível. <strong>[Remover se não houver.]</strong>
            </p>
        ),
    },
    {
        title: "6. Por quanto tempo guardamos?",
        content: (
            <p>
                Mantemos os dados enquanto a conta estiver ativa e pelo tempo necessário para cumprir
                obrigações legais. Documentos e registros fiscais e contábeis são guardados pelos prazos
                previstos em lei (em regra, 5 anos). Após esses períodos, os dados são eliminados ou
                anonimizados, salvo se houver outra hipótese legal de conservação.
            </p>
        ),
    },
    {
        title: "7. Como protegemos suas informações?",
        content: (
            <p>
                O acesso é restrito a usuários e profissionais autorizados. Adotamos medidas técnicas e
                administrativas para proteger os dados contra acessos não autorizados, perda, alteração ou
                divulgação indevida, como [CRIPTOGRAFIA EM TRÂNSITO, CONTROLE DE ACESSO, REGISTRO DE LOGS].
                Nenhum sistema é totalmente imune a incidentes; se ocorrer um que possa causar risco ou dano
                relevante, comunicaremos os titulares e a ANPD, conforme a lei.
            </p>
        ),
    },
    {
        title: "8. Seus direitos",
        content: (
            <>
                <p>Nos termos do art. 18 da LGPD, você pode solicitar:</p>
                <div className="mt-2">
                    <List
                        items={[
                            "Confirmação de que tratamos seus dados.",
                            "Acesso aos dados.",
                            "Correção de dados incompletos, inexatos ou desatualizados.",
                            "Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade.",
                            "Portabilidade dos dados, conforme regulamentação da ANPD.",
                            "Eliminação dos dados tratados com base em consentimento.",
                            "Informação sobre com quem compartilhamos seus dados.",
                            "Informação sobre a possibilidade de não consentir e suas consequências.",
                            "Revogação do consentimento.",
                        ]}
                    />
                </div>
                <p className="mt-2">
                    Alguns pedidos podem ser limitados por obrigações legais, como a guarda de dados fiscais. Se
                    você é cliente de um MEI e quer exercer seus direitos, pode contatar o MEI ou o canal abaixo,
                    e encaminharemos a solicitação ao controlador.
                </p>
            </>
        ),
    },
    {
        title: "9. Alterações desta política",
        content: (
            <p>
                Podemos atualizar esta política. Quando houver mudança relevante, avisaremos pela plataforma
                ou por e-mail e, se necessário, pediremos um novo aceite. A versão e a data de atualização
                constam ao final deste texto.
            </p>
        ),
    },
];

export function LGPDNoticeBody() {
    return (
        <>
            <p id="lgpd-intro" className="text-sm leading-relaxed">
                O ConciliaMEI valoriza a privacidade e a proteção dos seus dados pessoais e financeiros, em
                conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD). Esta
                política explica quais dados tratamos, por quê, com quem compartilhamos e como você exerce seus
                direitos.
            </p>

            {SECTIONS.map((s) => (
                <Section key={s.title} title={s.title}>
                    {s.content}
                </Section>
            ))}

            <p className="rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                <strong>Canal de privacidade / Encarregado (DPO):</strong> [NOME] — [E-MAIL]. Responderemos
                dentro dos prazos legais.
                <br />
                Versão {LGPD_NOTICE_VERSION} • Atualizada em {LGPD_NOTICE_UPDATED_AT}
            </p>
        </>
    );
}