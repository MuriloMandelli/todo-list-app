import type { Task as PrismaTask } from "@prisma/client";
import type { Task } from "@/types/task";

/** Converte o registro do Prisma para o formato consumido pela API/cliente. */
export function serializeTask(task: PrismaTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    // @db.Date guarda apenas a data; expomos como "YYYY-MM-DD".
    dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : null,
    status: task.status,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
