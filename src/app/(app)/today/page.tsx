"use client";

import { useMemo, useState } from "react";
import { useCollection } from "@/lib/store";
import {
  type Routine,
  type Event,
  type TimelineItem,
  DAY_NAMES,
} from "@/lib/types";
import { todayISO, minutesSinceMidnight, formatTime } from "@/lib/utils";
import Header from "@/components/Header";
import TimeBlock from "@/components/TimeBlock";
import EmptyState from "@/components/EmptyState";
import FAB from "@/components/FAB";
import EventForm from "@/components/EventForm";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

function shiftDate(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function TodayPage() {
  const [date, setDate] = useState(todayISO());
  const [routines] = useCollection<Routine>("routines");
  const [events] = useCollection<Event>("events");
  const [showAdd, setShowAdd] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const dayOfWeek = useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d).getDay();
  }, [date]);

  const items: TimelineItem[] = useMemo(() => {
    const r: TimelineItem[] = routines
      .filter((x) => x.day_of_week === null || x.day_of_week === dayOfWeek)
      .map((x) => ({
        kind: "routine",
        id: x.id,
        title: x.title,
        description: x.description,
        start_time: x.start_time,
        end_time: x.end_time,
        color: x.color,
      }));
    const e: TimelineItem[] = events
      .filter((x) => x.date === date)
      .map((x) => ({
        kind: "event",
        id: x.id,
        title: x.title,
        description: x.description,
        start_time: x.start_time,
        end_time: x.end_time,
        color: x.color,
        location: x.location,
      }));
    return [...r, ...e].sort(
      (a, b) =>
        minutesSinceMidnight(a.start_time) - minutesSinceMidnight(b.start_time)
    );
  }, [routines, events, dayOfWeek, date]);

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isToday = date === todayISO();

  return (
    <>
      <Header
        title={prettyDate(date)}
        subtitle={(() => {
          const [y, m, d] = date.split("-").map(Number);
          const dt = new Date(y, m - 1, d);
          return `${DAY_NAMES[dt.getDay()]}, ${dt.toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}`;
        })()}
        right={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDate(shiftDate(date, -1))}
              className="btn btn-ghost p-2"
              aria-label="Previous day"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setDate(todayISO())}
              className="btn btn-ghost text-xs px-2"
            >
              Today
            </button>
            <button
              onClick={() => setDate(shiftDate(date, 1))}
              className="btn btn-ghost p-2"
              aria-label="Next day"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {items.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={26} />}
            title="Nothing scheduled"
            description={
              isToday
                ? "Add an event for today or set up your routine."
                : "No events on this day."
            }
          />
        ) : (
          items.map((item) => {
            const startMin = minutesSinceMidnight(item.start_time);
            const endMin = item.end_time
              ? minutesSinceMidnight(item.end_time)
              : startMin + 30;
            const isPast = isToday && endMin < nowMin;
            const isCurrent =
              isToday && startMin <= nowMin && nowMin < endMin;
            return (
              <div
                key={`${item.kind}-${item.id}`}
                className={isPast ? "opacity-50" : ""}
              >
                {isCurrent && (
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-accent mb-1 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    Now • {formatTime(item.start_time)}
                  </div>
                )}
                <TimeBlock
                  title={item.title}
                  start={item.start_time}
                  end={item.end_time}
                  description={item.description}
                  color={item.color}
                  kind={item.kind}
                  location={item.location}
                  onClick={
                    item.kind === "event"
                      ? () => {
                          const ev = events.find((e) => e.id === item.id);
                          if (ev) setEditEvent(ev);
                        }
                      : undefined
                  }
                />
              </div>
            );
          })
        )}
      </main>

      <FAB onClick={() => setShowAdd(true)} label="Add event" />

      {showAdd && (
        <EventForm
          defaultDate={date}
          onClose={() => setShowAdd(false)}
          onSaved={() => setShowAdd(false)}
        />
      )}

      {editEvent && (
        <EventForm
          existing={editEvent}
          onClose={() => setEditEvent(null)}
          onSaved={() => setEditEvent(null)}
        />
      )}
    </>
  );
}
