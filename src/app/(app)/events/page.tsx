"use client";

import { useMemo, useState } from "react";
import { useCollection } from "@/lib/store";
import { type Event } from "@/lib/types";
import { todayISO, minutesSinceMidnight } from "@/lib/utils";
import Header from "@/components/Header";
import TimeBlock from "@/components/TimeBlock";
import EmptyState from "@/components/EmptyState";
import FAB from "@/components/FAB";
import EventForm from "@/components/EventForm";
import { CalendarPlus } from "lucide-react";

function groupByDate(events: Event[]) {
  const groups = new Map<string, Event[]>();
  for (const ev of events) {
    if (!groups.has(ev.date)) groups.set(ev.date, []);
    groups.get(ev.date)!.push(ev);
  }
  for (const list of groups.values()) {
    list.sort(
      (a, b) =>
        minutesSinceMidnight(a.start_time) -
        minutesSinceMidnight(b.start_time)
    );
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function prettyHeading(iso: string) {
  const today = todayISO();
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (iso === today) return "Today";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tISO = tomorrow.toISOString().slice(0, 10);
  if (iso === tISO) return "Tomorrow";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function EventsPage() {
  const [allEvents] = useCollection<Event>("events");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);

  const groups = useMemo(() => {
    const today = todayISO();
    return groupByDate(allEvents.filter((e) => e.date >= today));
  }, [allEvents]);

  return (
    <>
      <Header title="Events" subtitle="Upcoming meetings & one-off items" />

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {groups.length === 0 ? (
          <EmptyState
            icon={<CalendarPlus size={26} />}
            title="No upcoming events"
            description="Tap + to add a one-off meeting or event."
          />
        ) : (
          groups.map(([date, list]) => (
            <section key={date} className="space-y-2">
              <h2 className="text-sm font-medium text-fg-muted px-1">
                {prettyHeading(date)}
              </h2>
              {list.map((ev) => (
                <TimeBlock
                  key={ev.id}
                  title={ev.title}
                  start={ev.start_time}
                  end={ev.end_time}
                  description={ev.description}
                  color={ev.color}
                  location={ev.location}
                  onClick={() => setEditing(ev)}
                />
              ))}
            </section>
          ))
        )}
      </main>

      <FAB onClick={() => setShowAdd(true)} label="Add event" />

      {showAdd && (
        <EventForm
          defaultDate={todayISO()}
          onClose={() => setShowAdd(false)}
          onSaved={() => setShowAdd(false)}
        />
      )}
      {editing && (
        <EventForm
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => setEditing(null)}
        />
      )}
    </>
  );
}
