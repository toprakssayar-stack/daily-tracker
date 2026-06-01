"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { type Event, COLORS } from "@/lib/types";
import Modal from "./Modal";
import ColorPicker from "./ColorPicker";
import { Trash2 } from "lucide-react";

export default function EventForm({
  existing,
  defaultDate,
  onClose,
  onSaved,
}: {
  existing?: Event;
  defaultDate?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [date, setDate] = useState(existing?.date ?? defaultDate ?? "");
  const [startTime, setStartTime] = useState(
    existing?.start_time?.slice(0, 5) ?? "09:00"
  );
  const [endTime, setEndTime] = useState(existing?.end_time?.slice(0, 5) ?? "");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [color, setColor] = useState(existing?.color ?? COLORS[1]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      date,
      start_time: startTime,
      end_time: endTime || null,
      location: location.trim() || null,
      color,
    };
    if (existing) {
      store.update<Event>("events", existing.id, payload);
    } else {
      store.add<Event>("events", payload);
    }
    onSaved();
  }

  function remove() {
    if (!existing) return;
    if (!confirm("Delete this event?")) return;
    store.remove("events", existing.id);
    onSaved();
  }

  return (
    <Modal open onClose={onClose} title={existing ? "Edit event" : "New event"}>
      <form onSubmit={save} className="flex flex-col gap-3">
        <div>
          <label className="text-sm font-medium block mb-1.5">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Team meeting"
            required
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
            Location <span className="text-fg-muted font-normal">(optional)</span>
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Zoom, office, ..."
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">
            Notes <span className="text-fg-muted font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Color</label>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        <div className="flex gap-2 mt-2">
          <button type="submit" className="btn btn-primary flex-1">
            {existing ? "Save" : "Add event"}
          </button>
          {existing && (
            <button
              type="button"
              onClick={remove}
              className="btn btn-secondary text-danger"
              aria-label="Delete event"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
