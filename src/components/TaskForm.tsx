"use client";

import { useEffect, useState } from "react";
import type { Task, TaskInput, TaskStatus } from "@/types/task";
import { STATUS_LABELS } from "@/types/task";
import { ApiValidationError, createTask, updateTask } from "@/lib/api";

interface TaskFormProps {
  /** Se presente, o formulário está em modo edição. */
  task?: Task | null;
  onClose: () => void;
  onSaved: (task: Task) => void;
}

export default function TaskForm({ task, onClose, onSaved }: TaskFormProps) {
  const isEditing = Boolean(task);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "PENDENTE");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Fecha com a tecla ESC.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Validação rápida no cliente (o back-end revalida de qualquer forma).
    const localErrors: Record<string, string> = {};
    if (!title.trim()) localErrors.title = "O título é obrigatório.";
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    const input: TaskInput = {
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate || null,
      status,
    };

    setSubmitting(true);
    try {
      const saved =
        isEditing && task
          ? await updateTask(task.id, input)
          : await createTask(input);
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiValidationError) {
        setErrors(err.errors);
      } else {
        setErrors({
          _form: err instanceof Error ? err.message : "Erro ao salvar.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
          {isEditing ? "Editar tarefa" : "Nova tarefa"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Título (obrigatório) */}
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Título <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              maxLength={120}
              placeholder="Ex.: Enviar proposta ao cliente"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Detalhes da tarefa (opcional)"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Data prevista */}
            <div>
              <label
                htmlFor="dueDate"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Data prevista
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                aria-invalid={Boolean(errors.dueDate)}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              >
                {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errors._form && (
            <p className="text-sm text-red-600">{errors._form}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Salvando..." : isEditing ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
