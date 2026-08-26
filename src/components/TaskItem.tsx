"use client";

import type { Task } from "@/types/task";
import { STATUS_LABELS } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
  busy?: boolean;
}

/** Formata "YYYY-MM-DD" para "DD/MM/AAAA" sem sofrer com fuso horário. */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === "CONCLUIDA") return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate < today;
}

export default function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  busy,
}: TaskItemProps) {
  const done = task.status === "CONCLUIDA";
  const overdue = isOverdue(task);

  return (
    <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      {/* Checkbox rápido de conclusão */}
      <button
        type="button"
        onClick={() => onToggleStatus(task)}
        disabled={busy}
        aria-label={done ? "Marcar como pendente" : "Marcar como concluída"}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
          done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 hover:border-indigo-500 dark:border-slate-500"
        }`}
      >
        {done && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`font-semibold ${
              done
                ? "text-slate-400 line-through dark:text-slate-500"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {task.title}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              done
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
            }`}
          >
            {STATUS_LABELS[task.status]}
          </span>
        </div>

        {task.description && (
          <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">
            {task.description}
          </p>
        )}

        {task.dueDate && (
          <p
            className={`mt-2 flex items-center gap-1.5 text-xs ${
              overdue
                ? "font-medium text-red-600"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v7H4V8z"
                clipRule="evenodd"
              />
            </svg>
            {formatDate(task.dueDate)}
            {overdue && " (atrasada)"}
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => onEdit(task)}
          disabled={busy}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-700"
          aria-label="Editar tarefa"
          title="Editar"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M13.6 3.6a2 2 0 012.8 2.8L7 15.8l-3.8 1 1-3.8 9.4-9.4z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          disabled={busy}
          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
          aria-label="Excluir tarefa"
          title="Excluir"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M8 2a1 1 0 00-1 1v1H4a1 1 0 100 2h12a1 1 0 100-2h-3V3a1 1 0 00-1-1H8zM6 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}
