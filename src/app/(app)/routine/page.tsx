"use client";

import { useMemo, useState } from "react";
import { useCollection } from "@/lib/store";
import {
  type Routine,
  type DayOfWeek,
  DAY_NAMES,
  DAY_SHORT,
} from "@/lib/types";
import { minutesSinceMidnight, cn } from "@/lib/utils";
import Header from "@/components/Header";
import TimeBlock from "@/components/TimeBlock";
import EmptyState from "@/components/EmptyState";
import FAB from "@/components/FAB";
import RoutineForm from "@/components/RoutineForm";
import { Repeat } from "lucide-react";

export default function RoutinePage() {
  const [day, setDay] = useState<DayOfWeek>(
    ((new Date().getDay() || 1) as DayOfWeek)
  );
  const [routines] = useCollection<Routine>("routines");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Routine | null>(null);

  const filtered = useMemo(
    () =>
      routines
        .filter((r) => r.day_of_week === null || r.day_of_week === day)
        .sort(
          (a, b) =>
            minutesSinceMidnight(a.start_time) -
            minutesSinceMidnight(b.start_time)
        ),
    [routines, day]
  );

  return (
    <>
      <Header
        title="Routine"
        subtitle="Your repeating weekly schedule"
      />

      <div className="px-4 pt-3">
        <div className="grid grid-cols-7 gap-1">
          {DAY_SHORT.map((label, idx) => {
            const isActive = day === idx;
            const count = routines.filter(
              (r) => r.day_of_week === idx || r.day_of_week === null
            ).length;
            return (
              <button
                key={label}
                onClick={() => setDay(idx as DayOfWeek)}
                className={cn(
                  "py-2 rounded-lg text-xs font-medium border transition-colors flex flex-col items-center gap-0.5",
                  isActive
                    ? "border-accent text-accent-fg"
                    : "border-border text-fg-muted hover:text-fg"
                )}
                style={{
                  background: isActive ? "var(--accent)" : "transparent",
                }}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "text-[9px]",
                    isActive ? "opacity-80" : "opacity-60"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        <h2 className="text-sm font-medium text-fg-muted px-1">
          {DAY_NAMES[day]}
        </h2>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Repeat size={26} />}
            title="No routines for this day"
            description="Tap + to add a recurring item."
          />
        ) : (
          filtered.map((r) => (
            <TimeBlock
              key={r.id}
              title={r.title}
              start={r.start_time}
              end={r.end_time}
              description={
                r.day_of_week === null
                  ? `Every day${r.description ? ` • ${r.description}` : ""}`
                  : r.description
              }
              color={r.color}
              onClick={() => setEditing(r)}
            />
          ))
        )}
      </main>

      <FAB onClick={() => setShowAdd(true)} label="Add routine" />

      {showAdd && (
        <RoutineForm
          defaultDay={day}
          onClose={() => setShowAdd(false)}
          onSaved={() => setShowAdd(false)}
        />
      )}
      {editing && (
        <RoutineForm
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => setEditing(null)}
        />
      )}
    </>
  );
}
