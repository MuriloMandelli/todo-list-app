# Relato de entrega

## Como me organizei

Comecei lendo o enunciado com calma e separando o que era requisito obrigatório
do que era diferencial. Montei uma lista rápida do escopo:

1. CRUD completo de tarefas mais a pesquisa;
2. Campos: título obrigatório, descrição, data prevista com seletor de data e status;
3. Validações de título obrigatório e data válida;
4. Como diferencial, publicar a aplicação online.

Com isso claro, defini a arquitetura, implementei o back-end (modelo e API),
depois o front-end (tela e formulário) e, por fim, testei tudo localmente antes
de publicar.

## Ferramentas e tecnologias

- Next.js com App Router, usando React e TypeScript. As rotas de API ficam no
  mesmo projeto (Route Handlers), o que deixa a entrega enxuta e fácil de publicar.
- Prisma como ORM e PostgreSQL no Neon. Optei por um banco de verdade em vez de
  algo em memória, para exercitar persistência real. O Neon oferece Postgres no
  plano gratuito e combina bem com a Vercel.
- Tailwind CSS para a estilização.
- Vercel para o deploy, com deploy automático a cada push no GitHub.
- Também usei IA como apoio durante o desenvolvimento, para acelerar partes
  repetitivas e revisar decisões. Testei a aplicação de ponta a ponta e revisei
  todo o código antes de entregar.

## Decisões que considero relevantes

- Validação em dois níveis: a mesma regra roda no cliente, para dar retorno
  imediato, e no servidor, que é a fonte da verdade. Assim a API continua segura
  mesmo se for chamada diretamente, sem passar pela tela.
- Data como `@db.Date`: guardo apenas a data (sem hora) e trafego no formato
  `YYYY-MM-DD`, evitando o problema comum de fuso horário que faz a data voltar
  um dia.
- Pesquisa no back-end com debounce no front: a busca filtra por título e
  descrição direto no banco, sem diferenciar maiúsculas de minúsculas, e o front
  espera 300ms antes de disparar, para não fazer uma requisição a cada tecla.
- Ordenação pensada para o uso real: tarefas pendentes aparecem primeiro e, dentro
  de cada grupo, as mais recentes no topo. Tarefas com data vencida ganham um
  destaque visual de atrasada.
- Organização em camadas: tipos, validação, acesso ao banco e cliente HTTP ficam
  separados em `src/lib` e `src/types`, o que deixa o código mais fácil de
  navegar e de testar.

## O que eu adicionaria com mais tempo

- Testes automatizados (unitários da validação e de integração da API);
- Paginação para lidar com grandes volumes de tarefas;
- Autenticação, para cada usuário ter a própria lista.
