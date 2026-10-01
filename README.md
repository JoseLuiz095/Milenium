# Milenium ERP

Aplicação React para o site institucional e ERP operacional da Milenium, empresa de irrigação agrícola e serviços técnicos.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Produção

```bash
npm run build
npm run preview
```

O projeto usa Vite, React, TypeScript, PrimeReact e Supabase. A chave `service_role` nunca deve ser colocada no frontend; apenas a chave publicável pode aparecer nas variáveis `VITE_*`.

## Banco Milenium

O banco usa somente tabelas próprias com prefixo `milenium_`; nenhuma tabela, regra, membership ou dado da Academia é reutilizado. A mesma infraestrutura Supabase é usada apenas para evitar outro plano pago. Para aplicar manualmente no projeto `vnpoinodvchmmbyxpacj`, execute `0001_milenium_core.sql` e depois `0002_milenium_fk_indexes.sql` no SQL Editor. Depois configure no `.env`:

```env
VITE_SUPABASE_URL=https://vnpoinodvchmmbyxpacj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publicavel
```

Sem essas variáveis, os serviços usam dados mock locais para a interface continuar funcional.

## Fluxo inicial

Com as variáveis configuradas, acesse `/auth/cadastro`, crie o usuário administrador e cadastre a primeira empresa. O usuário recebe uma membership própria com papel `owner`; as telas do ERP ficam protegidas pela sessão do Supabase. A área pública continua disponível sem login.

## Deploy no Cloudflare Pages

O projeto já inclui `wrangler.toml` com build `npm run build` e saída `dist`. No Cloudflare Pages, conecte o repositório `JoseLuiz095/Milenium`, use `npm run build` como comando e `dist` como diretório de saída. Cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` nas variáveis de ambiente de produção.

## Estado da primeira entrega

O site institucional, o fluxo de acesso, o bootstrap da empresa e os módulos do ERP já estão navegáveis e compilados. A interface usa dados demonstrativos quando o Supabase não está configurado; com a configuração ativa, as consultas protegidas respeitam as memberships e o RLS do banco. O formulário público de orçamento mantém fallback local até a publicação de um endpoint server-side no Cloudflare, evitando expor `service_role` no navegador.
