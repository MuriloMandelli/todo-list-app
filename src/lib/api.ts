import type { Task, TaskInput } from "@/types/task";

/** Erro de validação vindo da API (campo -> mensagem). */
export class ApiValidationError extends Error {
  errors: Record<string, string>;
  constructor(errors: Record<string, string>) {
    super("Erro de validação");
    this.name = "ApiValidationError";
    this.errors = errors;
  }
}

async function parseError(res: Response): Promise<never> {
  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    // sem corpo JSON
  }
  if (
    payload &&
    typeof payload === "object" &&
    "errors" in payload &&
    payload.errors
  ) {
    throw new ApiValidationError(
      (payload as { errors: Record<string, string> }).errors
    );
  }
  const message =
    payload && typeof payload === "object" && "error" in payload
      ? String((payload as { error: unknown }).error)
      : "Ocorreu um erro inesperado.";
  throw new Error(message);
}

export async function fetchTasks(params: {
  search?: string;
  status?: string;
}): Promise<Task[]> {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.status) qs.set("status", params.status);
  const res = await fetch(`/api/tasks?${qs.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function createTask(input: TaskInput): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function updateTask(
  id: string,
  input: TaskInput
): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) await parseError(res);
}
