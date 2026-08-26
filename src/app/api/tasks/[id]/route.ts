import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateTask } from "@/lib/validation";
import { serializeTask } from "@/lib/serialize";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * PUT /api/tasks/:id
 * Atualiza uma tarefa existente (edição).
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;

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
    const task = await prisma.task.update({ where: { id }, data });
    return NextResponse.json(serializeTask(task));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Tarefa não encontrada." },
        { status: 404 }
      );
    }
    console.error("Erro ao atualizar tarefa:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar a tarefa." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/:id
 * Remove uma tarefa.
 */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    await prisma.task.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Tarefa não encontrada." },
        { status: 404 }
      );
    }
    console.error("Erro ao excluir tarefa:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir a tarefa." },
      { status: 500 }
    );
  }
}
