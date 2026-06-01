"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { type Routine, type DayOfWeek, COLORS, DAY_SHORT } from "@/lib/types";
import Modal from "./Modal";
import ColorPicker from "./ColorPicker";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoutineForm({
  existing,
  defaultDay,
  onClose,
  onSaved,
}: {
  existing?: Routine;
  defaultDay?: DayOfWeek | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [day, setDay] = useState<DayOfWeek | null>(
    existing ? existing.day_of_week : defaultDay ?? 1
  );
  const [everyDay, setEveryDay] = useState<boolean>(
    existing ? existing.day_of_week === null : false
  );
  const [startTime, setStartTime] = useState(
    existing?.start_time?.slice(0, 5) ?? "09:00"
  );
  const [endTime, setEndTime] = useState(existing?.end_time?.slice(0, 5) ?? "");
  const [color, setColor] = useState(existing?.color ?? COLORS[0]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      day_of_week: everyDay ? null : day,
      start_time: startTime,
      end_time: endTime || null,
      color,
    };
    if (existing) {
      store.update<Routine>("routines", existing.id, payload);
    } else {
      store.add<Routine>("routines", payload);
    }
    onSaved();
  }

  function remove() {
    if (!existing) return;
    if (!confirm("Delete this routine?")) return;
    store.remove("routines", existing.id);
    onSaved();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={existing ? "Edit routine" : "New routine"}
    >
      <form onSubmit={save} className="flex flex-col gap-3">
        <div>
          <label className="text-sm font-medium block mb-1.5">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Morning workout"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Day</label>
          <label className="flex items-center gap-2 mb-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              className="!w-auto"
              checked={everyDay}
              onChange={(e) => setEveryDay(e.target.checked)}
            />
            <span>Every day</span>
          </label>
          {!everyDay && (
            <div className="grid grid-cols-7 gap-1">
              {DAY_SHORT.map((label, idx) => {
                const isActive = day === idx;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDay(idx as DayOfWeek)}
                    className={cn(
                      "py-2 rounded-lg text-xs font-medium border transition-colors",
                      isActive
                        ? "border-accent text-accent-fg"
                        : "border-border text-fg-muted hover:text-fg"
                    )}
                    style={{
                      background: isActive ? "var(--accent)" : "transparent",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium block mb-1.5">Start</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">
              End{" "}
              <span className="text-fg-muted font-normal">(optional)</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">
            Notes <span className="text-fg-muted font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Color</label>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        <div className="flex gap-2 mt-2">
          <button type="submit" className="btn btn-primary flex-1">
            {existing ? "Save" : "Add routine"}
          </button>
          {existing && (
            <button
              type="button"
              onClick={remove}
              className="btn btn-secondary text-danger"
              aria-label="Delete routine"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
