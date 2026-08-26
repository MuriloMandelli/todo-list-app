# 📝 Relato de entrega

## Como me organizei

Comecei lendo o enunciado e separando o que era **requisito obrigatório** do que
era diferencial. Fiz uma lista rápida do escopo:

1. CRUD completo de tarefas + pesquisa;
2. Campos (título obrigatório, descrição, data prevista com date picker, status);
3. Validações (título obrigatório e data válida);
4. Diferencial: publicar online.

Depois defini a arquitetura, montei o back-end (modelo + API), o front-end
(tela + formulário) e, por fim, testei tudo localmente e publiquei.

## Ferramentas e tecnologias

- **Next.js (App Router) + React + TypeScript** — mesma base para front e back
  (as rotas de API ficam no mesmo projeto via Route Handlers), o que deixa a
  entrega enxuta e fácil de publicar.
- **Prisma + PostgreSQL (Neon)** — optei por um banco de verdade, e não algo em
  memória, para exercitar persistência real. O Neon oferece Postgres serverless
  no plano gratuito, que combina bem com a Vercel.
- **Tailwind CSS** — para uma interface limpa e responsiva sem sair escrevendo
  CSS do zero.
- **Vercel** — deploy contínuo a partir do GitHub.
- **IA (Claude Code)** — usei como par de programação para acelerar o boilerplate,
  revisar decisões e organizar o código. Todas as decisões técnicas foram
  revisadas e validadas por mim, e testei a aplicação de ponta a ponta.

## Decisões que considero relevantes

- **Validação em dois níveis:** a mesma regra roda no cliente (feedback imediato)
  e no servidor (fonte da verdade). Assim a API fica segura mesmo que alguém
  chame direto, sem passar pela tela.
- **Data como `@db.Date`:** guardo apenas a data (sem hora) e trafego no formato
  `YYYY-MM-DD`, evitando o clássico bug de fuso horário que faz a data "voltar
  um dia".
- **Pesquisa no back-end com debounce no front:** a busca filtra por título e
  descrição direto no banco (case-insensitive), e o front aguarda 300ms antes de
  disparar, para não fazer uma requisição a cada tecla.
- **Ordenação pensada para uso real:** tarefas pendentes aparecem primeiro e, dentro
  de cada grupo, as mais recentes no topo. Tarefas com data vencida ganham
  destaque visual de "atrasada".
- **Organização em camadas:** tipos, validação, acesso ao banco e cliente HTTP
  ficam separados em `src/lib` e `src/types`, deixando o código fácil de navegar
  e testar.

## O que eu adicionaria com mais tempo

- Testes automatizados (unitários da validação e de integração da API);
- Paginação para grandes volumes de tarefas;
- Autenticação, para cada usuário ter a sua própria lista.
