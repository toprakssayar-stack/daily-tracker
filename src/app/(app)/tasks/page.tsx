"use client";

import { useState } from "react";
import { store, useCollection } from "@/lib/store";
import { type Task } from "@/lib/types";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import FAB from "@/components/FAB";
import Modal from "@/components/Modal";
import {
  CheckSquare,
  Square,
  Trash2,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const [tasks] = useCollection<Task>("tasks");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [showDone, setShowDone] = useState(false);

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <>
      <Header
        title="Tasks"
        subtitle={`${open.length} open · ${done.length} done`}
      />

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {open.length === 0 && !showDone ? (
          <EmptyState
            icon={<CheckSquare size={26} />}
            title="All clear"
            description={
              tasks.length
                ? "No open tasks. Tap + to add one."
                : "Tap + to add your first task."
            }
          />
        ) : (
          <>
            {open.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                onToggle={() =>
                  store.update<Task>("tasks", t.id, { done: !t.done })
                }
                onClick={() => setEditing(t)}
              />
            ))}
            {done.length > 0 && (
              <button
                onClick={() => setShowDone(!showDone)}
                className="text-xs text-fg-muted px-1 pt-3"
              >
                {showDone ? "Hide" : "Show"} completed ({done.length})
              </button>
            )}
            {showDone &&
              done.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  onToggle={() =>
                    store.update<Task>("tasks", t.id, { done: !t.done })
                  }
                  onClick={() => setEditing(t)}
                />
              ))}
          </>
        )}
      </main>

      <FAB onClick={() => setShowAdd(true)} label="Add task" />

      {showAdd && (
        <TaskForm
          onClose={() => setShowAdd(false)}
          onSaved={() => setShowAdd(false)}
        />
      )}
      {editing && (
        <TaskForm
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => setEditing(null)}
        />
      )}
    </>
  );
}

function TaskRow({
  task,
  onToggle,
  onClick,
}: {
  task: Task;
  onToggle: () => void;
  onClick: () => void;
}) {
  return (
    <div className="card flex items-start gap-3">
      <button
        onClick={onToggle}
        className="shrink-0 mt-0.5 text-fg-muted hover:text-accent transition-colors"
        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
      >
        {task.done ? (
          <CheckSquare size={22} className="text-accent" />
        ) : (
          <Square size={22} />
        )}
      </button>
      <button onClick={onClick} className="flex-1 min-w-0 text-left">
        <p
          className={cn(
            "font-medium break-words",
            task.done && "line-through text-fg-muted"
          )}
        >
          {task.title}
        </p>
        {task.notes && (
          <p className="text-xs text-fg-muted line-clamp-2 mt-0.5">
            {task.notes}
          </p>
        )}
        {task.due_date && (
          <div className="flex items-center gap-1 text-xs text-fg-muted mt-1">
            <CalendarDays size={11} />
            <span>
              {new Date(task.due_date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}

function TaskForm({
  existing,
  onClose,
  onSaved,
}: {
  existing?: Task;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [dueDate, setDueDate] = useState(existing?.due_date ?? "");

  function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      notes: notes.trim() || null,
      due_date: dueDate || null,
    };
    if (existing) {
      store.update<Task>("tasks", existing.id, payload);
    } else {
      store.add<Task>("tasks", { ...payload, done: false });
    }
    onSaved();
  }

  function remove() {
    if (!existing) return;
    if (!confirm("Delete this task?")) return;
    store.remove("tasks", existing.id);
    onSaved();
  }

  return (
    <Modal open onClose={onClose} title={existing ? "Edit task" : "New task"}>
      <form onSubmit={save} className="flex flex-col gap-3">
        <div>
          <label className="text-sm font-medium block mb-1.5">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Buy groceries"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">
            Due date{" "}
            <span className="text-fg-muted font-normal">(optional)</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">
            Notes <span className="text-fg-muted font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="btn btn-primary flex-1">
            {existing ? "Save" : "Add task"}
          </button>
          {existing && (
            <button
              type="button"
              onClick={remove}
              className="btn btn-secondary text-danger"
              aria-label="Delete task"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
