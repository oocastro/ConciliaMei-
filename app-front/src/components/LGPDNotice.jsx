import { ShieldCheck } from "lucide-react";

function Section({ title, children }) {
    return (
        <section className="space-y-2">
            <h3 className="border-l-[3px] border-foreground pl-3 text-sm font-extrabold">{title}</h3>
            <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
        </section>
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
                <p className="text-xs text-muted-foreground">ConciliaMEI • Aviso de privacidade</p>
            </div>
            {children}
        </header>
    );
}

export function LGPDNoticeBody() {
    return (
        <>
            <p id="lgpd-intro" className="text-sm leading-relaxed">
                O ConciliaMEI valoriza a privacidade e a proteção dos seus dados pessoais e financeiros, em
                conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).
            </p>

            <Section title="Quais dados podem ser tratados?">
                <ul className="list-disc space-y-1 pl-5">
                    <li>Dados cadastrais da empresa e dos clientes, incluindo nome, CPF ou CNPJ.</li>
                    <li>Informações de notas fiscais de serviço.</li>
                    <li>Dados de pagamentos, movimentações financeiras e comprovantes.</li>
                    <li>Informações necessárias para autenticação e segurança da conta.</li>
                </ul>
            </Section>

            <Section title="Para que utilizamos esses dados?">
                <p>
                    Para viabilizar as funcionalidades da plataforma, como emissão e acompanhamento de NFS-e,
                    geração de cobranças Pix, conciliação de pagamentos, análise de comprovantes e segurança do
                    sistema.
                </p>
            </Section>

            <Section title="Como protegemos suas informações?">
                <p>
                    O acesso deve ser restrito a usuários autorizados, com medidas técnicas e administrativas para
                    prevenir acessos não autorizados, perda, alteração ou divulgação indevida.
                </p>
            </Section>

            <Section title="Seus direitos">
                <p>
                    Nos termos da LGPD, você pode solicitar, conforme aplicável, confirmação do tratamento, acesso,
                    correção e outras providências relativas aos seus dados pessoais, observadas as condições
                    legais.
                </p>
            </Section>

            <p className="rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                Para exercer seus direitos ou esclarecer dúvidas, entre em contato pelo canal de privacidade
                disponibilizado pelo responsável pelo sistema.
            </p>
        </>
    );
}