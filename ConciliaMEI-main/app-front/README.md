# Dashboard — Conciliação Fiscal (NFS-e)

Protótipo da tela inicial pós-login do sistema de conciliação financeira e
fiscal (TCC). Mostra o resumo de notas fiscais, pendências que precisam de
atenção e a lista de notas mais recentes com filtro por status.

## Rodando localmente

```bash
npm install
npm run dev
```

## Stack

- React 19 + Vite
- Tailwind CSS v4
- shadcn/ui (componentes em `src/components/ui`)
- lucide-react (ícones)
- date-fns (formatação de datas)

Os dados exibidos em `src/DashboardPage.jsx` são mockados diretamente no
componente — ainda não há integração com API.
