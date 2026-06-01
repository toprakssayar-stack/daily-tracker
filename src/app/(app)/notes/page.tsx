"use client";

import { useMemo, useState } from "react";
import { store, useCollection } from "@/lib/store";
import { type Note } from "@/lib/types";
import { todayISO } from "@/lib/utils";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import FAB from "@/components/FAB";
import Modal from "@/components/Modal";
import { StickyNote, Trash2 } from "lucide-react";

export default function NotesPage() {
  const [notes] = useCollection<Note>("notes");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);

  const sorted = useMemo(
    () =>
      [...notes].sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return b.created_at.localeCompare(a.created_at);
      }),
    [notes]
  );

  return (
    <>
      <Header title="Notes" subtitle="Quick thoughts, by date" />

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {sorted.length === 0 ? (
          <EmptyState
            icon={<StickyNote size={26} />}
            title="No notes yet"
            description="Tap + to write your first note."
          />
        ) : (
          sorted.map((n) => (
            <button
              key={n.id}
              onClick={() => setEditing(n)}
              className="card text-left w-full hover:bg-bg-elev-2 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium truncate">
                  {n.title || "Untitled"}
                </h3>
                <span className="text-[11px] text-fg-muted shrink-0">
                  {new Date(n.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm text-fg-muted mt-1 line-clamp-3 whitespace-pre-wrap">
                {n.content}
              </p>
            </button>
          ))
        )}
      </main>

      <FAB onClick={() => setShowAdd(true)} label="Add note" />

      {showAdd && (
        <NoteForm
          onClose={() => setShowAdd(false)}
          onSaved={() => setShowAdd(false)}
        />
      )}
      {editing && (
        <NoteForm
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => setEditing(null)}
        />
      )}
    </>
  );
}

function NoteForm({
  existing,
  onClose,
  onSaved,
}: {
  existing?: Note;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [date, setDate] = useState(existing?.date ?? todayISO());

  function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: title.trim() || null,
      content: content.trim(),
      date,
    };
    if (existing) {
      store.update<Note>("notes", existing.id, payload);
    } else {
      store.add<Note>("notes", payload);
    }
    onSaved();
  }

  function remove() {
    if (!existing) return;
    if (!confirm("Delete this note?")) return;
    store.remove("notes", existing.id);
    onSaved();
  }

  return (
    <Modal open onClose={onClose} title={existing ? "Edit note" : "New note"}>
      <form onSubmit={save} className="flex flex-col gap-3">
        <div>
          <label className="text-sm font-medium block mb-1.5">
            Title{" "}
            <span className="text-fg-muted font-normal">(optional)</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            autoFocus
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="btn btn-primary flex-1">
            {existing ? "Save" : "Add note"}
          </button>
          {existing && (
            <button
              type="button"
              onClick={remove}
              className="btn btn-secondary text-danger"
              aria-label="Delete note"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
