# To-do List

Aplicação web de lista de tarefas. Permite adicionar, listar, editar, excluir e
pesquisar tarefas, com validações e persistência em banco de dados.

## Funcionalidades

- Adicionar tarefa
- Listar tarefas (pendentes primeiro, mais recentes no topo)
- Editar tarefa
- Excluir tarefa (com confirmação)
- Pesquisar por título ou descrição (com debounce)
- Filtrar por status (Pendente / Concluída)
- Marcar como concluída em um clique
- Destaque para tarefas atrasadas

### Campos da tarefa

| Campo         | Tipo                     | Regras                          |
| ------------- | ------------------------ | ------------------------------- |
| Título        | Texto curto              | Obrigatório (até 120 caracteres) |
| Descrição     | Texto livre              | Opcional                        |
| Data prevista | Seletor de data (`date`) | Opcional, mas deve ser válida   |
| Status        | Pendente / Concluída     | Padrão: Pendente                |

As validações são aplicadas no cliente (feedback rápido) e no servidor (fonte da
verdade), na função compartilhada [`validateTask`](src/lib/validation.ts).

## Tecnologias

- Next.js (App Router): front-end React e back-end via Route Handlers
- React + TypeScript
- Tailwind CSS
- Prisma (ORM)
- PostgreSQL (Neon)
- Deploy na Vercel

## Rodando localmente

### 1. Pré-requisitos

- Node.js 18 ou superior
- Um banco PostgreSQL (recomendado o [Neon](https://neon.tech), gratuito)

### 2. Instalação

```bash
git clone https://github.com/MuriloMandelli/todo-list-app.git
cd todo-list-app
npm install
```

### 3. Variáveis de ambiente

Copie o exemplo e preencha com as suas credenciais do Neon:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://...-pooler...neon.tech/db?sslmode=require"
DIRECT_URL="postgresql://...neon.tech/db?sslmode=require"
```

- `DATABASE_URL`: string com pooler (o host contém `-pooler`), usada pela aplicação.
- `DIRECT_URL`: string sem pooler, usada pelo Prisma nas migrations.

### 4. Banco de dados

```bash
npx prisma migrate dev
```

### 5. Executar

```bash
npm run dev
```

Acesse http://localhost:3000.

## API

Base: `/api/tasks`

| Método   | Rota             | Descrição                                     |
| -------- | ---------------- | --------------------------------------------- |
| `GET`    | `/api/tasks`     | Lista tarefas. Query: `?search=` e `?status=` |
| `POST`   | `/api/tasks`     | Cria tarefa                                    |
| `PUT`    | `/api/tasks/:id` | Atualiza tarefa                                |
| `DELETE` | `/api/tasks/:id` | Exclui tarefa                                  |

## Estrutura

```
prisma/
  schema.prisma             # modelo Task e enum de status
src/
  app/
    api/tasks/route.ts       # GET (lista/busca) e POST
    api/tasks/[id]/route.ts  # PUT e DELETE
    page.tsx                 # tela principal
    layout.tsx
  components/
    TaskForm.tsx             # modal de criar/editar
    TaskItem.tsx             # card de cada tarefa
  lib/
    prisma.ts                # singleton do Prisma Client
    validation.ts            # validação compartilhada
    serialize.ts             # Prisma para o formato da API
    api.ts                   # cliente HTTP do front
  types/
    task.ts                  # tipos compartilhados
```
