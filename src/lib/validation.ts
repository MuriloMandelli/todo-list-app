import type { TaskInput, TaskStatus } from "@/types/task";

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  data?: {
    title: string;
    description: string | null;
    dueDate: Date | null;
    status: TaskStatus;
  };
}

const VALID_STATUS: TaskStatus[] = ["PENDENTE", "CONCLUIDA"];

// Aceita apenas datas no formato "YYYY-MM-DD" (o value do <input type="date">).
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Valida e normaliza a entrada de uma tarefa.
 * Usada no back-end (fonte da verdade) e reaproveitável no front.
 */
export function validateTask(input: Partial<TaskInput>): ValidationResult {
  const errors: Record<string, string> = {};

  // Título: obrigatório.
  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title) {
    errors.title = "O título é obrigatório.";
  } else if (title.length > 120) {
    errors.title = "O título deve ter no máximo 120 caracteres.";
  }

  // Descrição: opcional.
  const description =
    typeof input.description === "string" && input.description.trim() !== ""
      ? input.description.trim()
      : null;

  // Data prevista: opcional, mas se enviada precisa ser válida.
  let dueDate: Date | null = null;
  if (input.dueDate) {
    if (!DATE_REGEX.test(input.dueDate)) {
      errors.dueDate = "A data prevista deve estar no formato AAAA-MM-DD.";
    } else {
      const parsed = new Date(`${input.dueDate}T00:00:00.000Z`);
      // Garante que a data existe de fato (ex.: 2026-02-30 é inválida).
      if (Number.isNaN(parsed.getTime()) || !parsed.toISOString().startsWith(input.dueDate)) {
        errors.dueDate = "A data prevista é inválida.";
      } else {
        dueDate = parsed;
      }
    }
  }

  // Status: opcional; default PENDENTE.
  let status: TaskStatus = "PENDENTE";
  if (input.status !== undefined) {
    if (!VALID_STATUS.includes(input.status)) {
      errors.status = "Status inválido.";
    } else {
      status = input.status;
    }
  }

  const valid = Object.keys(errors).length === 0;
  return {
    valid,
    errors,
    data: valid ? { title, description, dueDate, status } : undefined,
  };
}
