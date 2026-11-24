# Rotas do ConciliaMEI

## Frontend (React Router)

| Caminho | Tela | Acesso |
|---|---|---|
| `/` | Página inicial | Público |
| `/auth/login` | Login | Público |
| `/auth/register` | Cadastro de usuário | Público |
| `/auth/forgot-password` | Solicitar recuperação | Público |
| `/auth/reset-password` | Redefinir senha | Público |
| `/dashboard` | Painel | Autenticado |
| `/empresas` | Cadastro/consulta da empresa vinculada | Autenticado |
| `/conciliacao` | Conciliação | Autenticado |
| `/pagamentos` | Pagamentos | Autenticado |
| `/settings` | Configurações do perfil | Autenticado |

Os caminhos antigos `/auth/sign-up` e `/auth/signin` continuam aceitos como aliases de login e cadastro, respectivamente. `/notas` redireciona para `/empresas`.

## Endpoints que o frontend espera

A base é `VITE_API_URL`. Quando vazia, o Vite usa o proxy configurado em `vite.config.js` (atualmente `http://localhost:8080`).

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/auth/login` | Autenticar; resposta esperada inclui `token` e `name` |
| POST | `/auth/register` | Criar usuário; resposta esperada inclui `token` e `name` |
| GET | `/api/empresas/consulta-cnpj/:cnpj` | Consultar CNPJ antes do cadastro |
| POST | `/api/empresas` | Vincular empresa ao usuário autenticado; body `{ "cnpj": "..." }` |
| GET | `/api/empresas/minha-empresa` | Buscar empresa do usuário autenticado |

As chamadas de empresa enviam `Authorization: Bearer <token>`.

## Atenção: backend não veio completo neste ZIP

O projeto contém `app-back-node`, mas nele só existe a rota de saúde (`/api/health`). `auth.routes.js` e `auth.controller.js` estão vazios e não existem rotas Node para `/auth/login`, `/auth/register` ou `/api/empresas`. O `vite.config.js` aponta para um backend Spring em `localhost:8080`, porém o código Java/Spring não está presente no ZIP recebido.

Por isso, as rotas e ligações do React foram organizadas e o build foi validado, mas não é possível afirmar que a comunicação real com o banco/backend esteja concluída sem o backend Spring correto ou sem implementar os contratos acima no Node. As telas de Conciliação e Pagamentos também ainda não fazem requisições de dados neste material.
