
import { ShieldCheck } from "lucide-react";

export const LGPD_NOTICE_VERSION = "2.0";
export const LGPD_NOTICE_UPDATED_AT = "18/11/2026";

function Section({ title, children }) {
    return (
        <section className="space-y-2">
            <h3 className="border-l-[3px] border-foreground pl-3 text-sm font-extrabold">
                {title}
            </h3>
            <div className="text-sm leading-relaxed text-muted-foreground">
                {children}
            </div>
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
                    ConciliaMEI • Aviso de Privacidade • v{LGPD_NOTICE_VERSION}
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
                    O ConciliaMEI é operado por{" "}
                    <strong>[NOME OU RAZÃO SOCIAL DO RESPONSÁVEL]</strong>,
                    inscrito no CPF/CNPJ sob o nº{" "}
                    <strong>[CPF OU CNPJ, CONFORME APLICÁVEL]</strong>.
                    Para assuntos relacionados à privacidade e proteção de
                    dados, entre em contato pelo e-mail{" "}
                    <strong>[E-MAIL DE PRIVACIDADE]</strong>.
                </p>

                <p className="mt-2">
                    O responsável pelo ConciliaMEI atua como controlador dos
                    dados pessoais tratados para cadastro, autenticação,
                    funcionamento e disponibilização da plataforma,
                    observadas as responsabilidades previstas na LGPD.
                </p>
            </>
        ),
    },
    {
        title: "2. Quais dados podemos tratar?",
        content: (
            <>
                <p>
                    Para disponibilizar as funcionalidades do ConciliaMEI,
                    podemos tratar as seguintes categorias de dados:
                </p>

                <div className="mt-2">
                    <List
                        items={[
                            "Dados de cadastro: nome, endereço de e-mail e informações necessárias para identificação e gerenciamento da conta.",
                            "Dados de autenticação: informações relacionadas ao acesso, credenciais protegidas e registros de autenticação.",
                            "Dados de contas financeiras: nomes personalizados das contas, instituições financeiras informadas, tipos de conta e saldos cadastrados.",
                            "Dados de movimentações financeiras: descrições, datas, valores, tipos de movimentação e categorias de receitas e despesas.",
                            "Dados de extratos bancários: informações contidas nos arquivos OFX ou CSV enviados pelo próprio usuário, como lançamentos, datas, valores e descrições.",
                            "Dados de conciliação: informações utilizadas para comparar movimentações importadas com registros financeiros e apresentar possíveis correspondências.",
                            "Dados técnicos e de utilização: endereço IP, registros de acesso, informações do navegador e eventos necessários à segurança e ao funcionamento da plataforma.",
                        ]}
                    />
                </div>

                <p className="mt-2">
                    Os dados financeiros tratados podem revelar informações
                    sobre a vida econômica do usuário e, por isso, recebem
                    cuidados de proteção compatíveis com sua natureza.
                </p>
            </>
        ),
    },
    {
        title: "3. Para que utilizamos os dados?",
        content: (
            <>
                <p>
                    Os dados são utilizados para finalidades relacionadas
                    ao funcionamento do ConciliaMEI, incluindo:
                </p>

                <div className="mt-2">
                    <List
                        items={[
                            "Criar e administrar a conta do usuário: execução de contrato ou procedimentos preliminares relacionados ao serviço (art. 7º, V, da LGPD).",
                            "Disponibilizar o controle de contas, receitas, despesas e movimentações financeiras: execução de contrato (art. 7º, V).",
                            "Receber e processar extratos OFX e CSV enviados pelo usuário: execução de contrato (art. 7º, V).",
                            "Identificar possíveis correspondências entre movimentações importadas e registros financeiros, apresentando sugestões para análise e confirmação do usuário: execução de contrato (art. 7º, V).",
                            "Manter a segurança da plataforma, prevenir fraudes e identificar atividades suspeitas: legítimo interesse, quando aplicável e após avaliação dos direitos do titular (art. 7º, IX).",
                            "Cumprir obrigações legais ou regulatórias, quando existentes: obrigação legal ou regulatória (art. 7º, II).",
                            "Exercer direitos em processos judiciais, administrativos ou arbitrais: exercício regular de direitos (art. 7º, VI).",
                        ]}
                    />
                </div>
            </>
        ),
    },
    {
        title: "4. Importação de extratos bancários",
        content: (
            <>
                <p>
                    O ConciliaMEI permite que o usuário envie manualmente
                    arquivos de extratos bancários nos formatos OFX e CSV,
                    quando suportados pela plataforma.
                </p>

                <p className="mt-2">
                    As informações desses arquivos podem ser processadas
                    para registrar movimentações financeiras, organizar
                    receitas e despesas e sugerir correspondências para
                    conciliação bancária.
                </p>

                <p className="mt-2">
                    A importação é realizada a partir dos arquivos
                    disponibilizados pelo próprio usuário. O ConciliaMEI
                    não solicita senhas bancárias, não solicita códigos
                    de acesso à conta bancária e não deve receber
                    credenciais bancárias do usuário.
                </p>

                <p className="mt-2">
                    Antes de importar um extrato, o usuário deve verificar
                    se o arquivo contém somente informações que deseja
                    disponibilizar à plataforma.
                </p>
            </>
        ),
    },
    {
        title: "5. Como funciona a conciliação bancária?",
        content: (
            <>
                <p>
                    O ConciliaMEI pode comparar informações de extratos
                    importados com movimentações financeiras registradas
                    na plataforma, considerando dados como valor, data e
                    descrição.
                </p>

                <p className="mt-2">
                    Quando forem identificadas possíveis correspondências,
                    o sistema poderá apresentar sugestões para que o
                    usuário analise e confirme a conciliação.
                </p>

                <p className="mt-2">
                    A sugestão de correspondência não representa,
                    necessariamente, uma confirmação de pagamento ou
                    recebimento pela instituição financeira. A conferência
                    das informações e a decisão de confirmar uma
                    conciliação são de responsabilidade do usuário.
                </p>
            </>
        ),
    },
    {
        title: "6. Com quem compartilhamos os dados?",
        content: (
            <>
                <p>
                    O ConciliaMEI não comercializa dados pessoais.
                    O compartilhamento poderá ocorrer somente quando
                    necessário para as finalidades informadas neste aviso,
                    incluindo:
                </p>

                <div className="mt-2">
                    <List
                        items={[
                            "Provedores de hospedagem e infraestrutura: [INFORMAR OS PROVEDORES UTILIZADOS E OS PAÍSES DE PROCESSAMENTO].",
                            "Provedores de banco de dados: [INFORMAR O PROVEDOR UTILIZADO].",
                            "Serviços de autenticação, segurança e monitoramento: [INFORMAR, SE APLICÁVEL].",
                            "Autoridades públicas: quando houver obrigação legal, regulatória ou ordem válida de autoridade competente.",
                        ]}
                    />
                </div>

                <p className="mt-2">
                    Os prestadores de serviço envolvidos devem tratar os
                    dados somente dentro das finalidades necessárias à
                    prestação dos serviços contratados e das obrigações
                    aplicáveis.
                </p>
            </>
        ),
    },
    {
        title: "7. Transferência internacional de dados",
        content: (
            <p>
                Alguns fornecedores de tecnologia utilizados pelo
                ConciliaMEI podem armazenar ou processar dados fora do
                Brasil. Quando houver transferência internacional,
                ela deverá observar os requisitos previstos na LGPD
                e na regulamentação aplicável da Autoridade Nacional
                de Proteção de Dados (ANPD).
                As informações sobre os fornecedores e os países
                envolvidos devem ser disponibilizadas de acordo com
                a infraestrutura efetivamente utilizada pela plataforma.
            </p>
        ),
    },
    {
        title: "8. Por quanto tempo guardamos os dados?",
        content: (
            <>
                <p>
                    Os dados são mantidos pelo período necessário para
                    disponibilizar as funcionalidades do ConciliaMEI,
                    administrar a conta do usuário, cumprir as finalidades
                    descritas neste aviso e atender às obrigações legais
                    aplicáveis.
                </p>

                <p className="mt-2">
                    Quando a conta for encerrada ou o usuário solicitar
                    a exclusão de seus dados, as informações serão
                    eliminadas ou anonimizadas quando possível, observadas
                    as hipóteses legais que autorizam ou exigem sua
                    conservação.
                </p>

                <p className="mt-2">
                    Os arquivos originais de extratos importados serão
                    armazenados somente conforme a política de retenção
                    efetivamente adotada pela plataforma. O tratamento
                    das informações extraídas desses arquivos poderá
                    continuar enquanto os registros financeiros forem
                    necessários à utilização do serviço.
                </p>
            </>
        ),
    },
    {
        title: "9. Como protegemos suas informações?",
        content: (
            <>
                <p>
                    O ConciliaMEI adota ou busca adotar medidas técnicas
                    e administrativas adequadas para proteger os dados
                    pessoais contra acessos não autorizados, perda,
                    destruição, alteração ou tratamento inadequado.
                </p>

                <p className="mt-2">
                    Essas medidas devem incluir, conforme implementadas
                    na plataforma:
                </p>

                <div className="mt-2">
                    <List
                        items={[
                            "Controle de acesso às contas e aos recursos do sistema.",
                            "Autenticação de usuários.",
                            "Proteção das credenciais de acesso.",
                            "Uso de conexões seguras para transmissão de dados.",
                            "Restrição do acesso aos dados conforme a necessidade de utilização.",
                            "Medidas de monitoramento e prevenção de acessos indevidos, quando disponíveis.",
                        ]}
                    />
                </div>

                <p className="mt-2">
                    Nenhum ambiente tecnológico é completamente livre
                    de riscos. Caso ocorra incidente de segurança que
                    possa acarretar risco ou dano relevante aos titulares,
                    serão adotadas as providências e comunicações
                    exigidas pela legislação e pela regulamentação
                    aplicável.
                </p>
            </>
        ),
    },
    {
        title: "10. Quais são os seus direitos?",
        content: (
            <>
                <p>
                    Nos termos do art. 18 da LGPD, você poderá solicitar,
                    conforme aplicável:
                </p>

                <div className="mt-2">
                    <List
                        items={[
                            "Confirmação da existência de tratamento de dados pessoais.",
                            "Acesso aos dados pessoais tratados.",
                            "Correção de dados incompletos, inexatos ou desatualizados.",
                            "Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.",
                            "Portabilidade dos dados, observada a regulamentação aplicável.",
                            "Eliminação dos dados tratados com base no consentimento, quando cabível.",
                            "Informação sobre as entidades públicas e privadas com as quais houve compartilhamento de dados.",
                            "Informação sobre a possibilidade de não fornecer consentimento e suas consequências, quando o tratamento depender dessa base legal.",
                            "Revogação do consentimento, quando aplicável.",
                        ]}
                    />
                </div>

                <p className="mt-2">
                    O exercício desses direitos poderá ser solicitado
                    pelo canal de privacidade indicado ao final deste
                    aviso. Algumas solicitações podem estar sujeitas
                    a limitações legais, especialmente quando houver
                    necessidade de conservação dos dados.
                </p>
            </>
        ),
    },
    {
        title: "11. Exclusão da conta e dos dados",
        content: (
            <p>
                O usuário poderá solicitar o encerramento de sua conta
                e a exclusão dos dados pessoais associados, por meio
                dos canais disponibilizados pelo ConciliaMEI.
                A solicitação será analisada e atendida conforme
                as possibilidades técnicas e os requisitos legais.
                Dados que precisem ser mantidos por obrigação legal,
                exercício regular de direitos ou outra hipótese
                prevista na LGPD poderão ser conservados pelo período
                necessário, com acesso restrito e finalidade limitada.
            </p>
        ),
    },
    {
        title: "12. Alterações deste aviso",
        content: (
            <p>
                Este Aviso de Privacidade poderá ser atualizado para
                refletir mudanças nas funcionalidades do ConciliaMEI,
                nos procedimentos de tratamento de dados ou na
                legislação aplicável. Quando houver alterações
                relevantes, o usuário poderá ser comunicado pela
                plataforma ou por e-mail. A versão e a data da
                atualização estarão indicadas ao final deste documento.
            </p>
        ),
    },
    {
        title: "13. Contato sobre privacidade",
        content: (
            <>
                <p>
                    Para esclarecer dúvidas, exercer seus direitos ou
                    realizar solicitações relacionadas ao tratamento
                    de dados pessoais, entre em contato:
                </p>

                <p className="mt-2">
                    <strong>E-mail:</strong> [E-MAIL DE PRIVACIDADE]
                </p>

                <p className="mt-2">
                    <strong>Responsável:</strong> [NOME DO RESPONSÁVEL]
                </p>
            </>
        ),
    },
];

export function LGPDNoticeBody() {
    return (
        <>
            <p id="lgpd-intro" className="text-sm leading-relaxed">
                O ConciliaMEI valoriza a privacidade e a proteção dos
                dados pessoais e financeiros de seus usuários.
                Este Aviso de Privacidade explica como coletamos,
                utilizamos, armazenamos e protegemos informações
                durante a utilização da plataforma, em conformidade
                com a Lei nº 13.709/2018 — Lei Geral de Proteção
                de Dados Pessoais (LGPD).
            </p>

            {SECTIONS.map((s) => (
                <Section key={s.title} title={s.title}>
                    {s.content}
                </Section>
            ))}

            <p className="rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                <strong>Canal de privacidade:</strong>{" "}
                [NOME DO RESPONSÁVEL] — [E-MAIL DE PRIVACIDADE].
                <br />
                Versão {LGPD_NOTICE_VERSION} • Atualizada em{" "}
                {LGPD_NOTICE_UPDATED_AT}
            </p>
        </>
    );
}
