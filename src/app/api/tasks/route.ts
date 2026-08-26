import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateTask } from "@/lib/validation";
import { serializeTask } from "@/lib/serialize";
import type { TaskStatus } from "@/types/task";

// Nunca cachear: os dados mudam a cada operação.
export const dynamic = "force-dynamic";

/**
 * GET /api/tasks
 * Lista tarefas. Suporta:
 *   ?search=texto   -> filtra por título ou descrição (case-insensitive)
 *   ?status=PENDENTE|CONCLUIDA -> filtra por status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const status = searchParams.get("status")?.trim();

  const where: Prisma.TaskWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status === "PENDENTE" || status === "CONCLUIDA") {
    where.status = status as TaskStatus;
  }

  try {
    const tasks = await prisma.task.findMany({
      where,
      // Pendentes primeiro; dentro de cada grupo, mais recentes no topo.
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(tasks.map(serializeTask));
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as tarefas." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Cria uma nova tarefa.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const { valid, errors, data } = validateTask(body ?? {});
  if (!valid || !data) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const task = await prisma.task.create({ data });
    return NextResponse.json(serializeTask(task), { status: 201 });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return NextResponse.json(
      { error: "Não foi possível criar a tarefa." },
      { status: 500 }
    );
  }
}
