"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Task, TaskStatus } from "@/types/task";
import { deleteTask, fetchTasks, updateTask } from "@/lib/api";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";

type StatusFilter = "" | TaskStatus;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Debounce da busca para não disparar uma requisição por tecla.
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks({
        search: debouncedSearch,
        status: statusFilter,
      });
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "CONCLUIDA").length;
    return { total, done, pending: total - done };
  }, [tasks]);

  function openCreate() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function handleSaved() {
    setFormOpen(false);
    setEditingTask(null);
    load();
  }

  async function handleDelete(task: Task) {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return;
    setBusyId(task.id);
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleStatus(task: Task) {
    const next: TaskStatus =
      task.status === "CONCLUIDA" ? "PENDENTE" : "CONCLUIDA";
    setBusyId(task.id);
    try {
      const updated = await updateTask(task.id, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: next,
      });
      // Atualiza localmente; recarrega para respeitar a ordenação por status.
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar.");
    } finally {
      setBusyId(null);
    }
  }

  const hasFilters = debouncedSearch !== "" || statusFilter !== "";

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
      {/* Cabeçalho */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          ✅ Lista de Tarefas
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {stats.total} tarefa{stats.total === 1 ? "" : "s"} • {stats.pending}{" "}
          pendente{stats.pending === 1 ? "" : "s"} • {stats.done} concluída
          {stats.done === 1 ? "" : "s"}
        </p>
      </header>

      {/* Barra de ações: busca + filtro + nova tarefa */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 103.4 9.8l3.4 3.4a1 1 0 001.4-1.4l-3.4-3.4A5.5 5.5 0 009 3.5zM5.5 9a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar tarefas..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        >
          <option value="">Todos</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="CONCLUIDA">Concluídas</option>
        </select>

        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Nova tarefa
        </button>
      </div>

      {/* Estados */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
          {error}{" "}
          <button onClick={load} className="font-semibold underline">
            Tentar novamente
          </button>
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-slate-500 dark:text-slate-400">
          Carregando...
        </p>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-600">
          <p className="text-slate-500 dark:text-slate-400">
            {hasFilters
              ? "Nenhuma tarefa encontrada para esses filtros."
              : "Nenhuma tarefa ainda. Crie a primeira! 🚀"}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              busy={busyId === task.id}
            />
          ))}
        </ul>
      )}

      {formOpen && (
        <TaskForm
          task={editingTask}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </main>
  );
}
