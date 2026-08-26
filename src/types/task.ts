export type TaskStatus = "PENDENTE" | "CONCLUIDA";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  /** Data prevista no formato ISO "YYYY-MM-DD" (ou null). */
  dueDate: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

/** Dados enviados pelo formulário ao criar/editar uma tarefa. */
export interface TaskInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status?: TaskStatus;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDENTE: "Pendente",
  CONCLUIDA: "Concluída",
};
