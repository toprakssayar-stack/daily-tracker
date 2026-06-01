"use client";

import { useEffect } from "react";
import { store } from "@/lib/store";
import { type Routine, type Event } from "@/lib/types";
import { todayISO } from "@/lib/utils";

const STORAGE_KEY = "notifications-enabled";
const LEAD_MINUTES_KEY = "notifications-lead-minutes";

export function notificationsEnabled() {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem(STORAGE_KEY) === "true" &&
    "Notification" in window &&
    Notification.permission === "granted"
  );
}

export function getLeadMinutes() {
  if (typeof window === "undefined") return 10;
  const v = localStorage.getItem(LEAD_MINUTES_KEY);
  return v ? parseInt(v, 10) : 10;
}

export default function NotificationScheduler() {
  useEffect(() => {
    if (!notificationsEnabled()) return;
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;

    async function scheduleAll() {
      const date = todayISO();
      const dayOfWeek = new Date().getDay();
      const lead = getLeadMinutes();

      const routines = store
        .list<Routine>("routines")
        .filter((r) => r.day_of_week === null || r.day_of_week === dayOfWeek);
      const events = store
        .list<Event>("events")
        .filter((e) => e.date === date);

      if (cancelled) return;

      const reg = await navigator.serviceWorker.ready;
      const now = new Date();

      const schedule = (
        title: string,
        body: string,
        startTime: string,
        tag: string
      ) => {
        const [h, m] = startTime.split(":").map(Number);
        const when = new Date();
        when.setHours(h, m - lead, 0, 0);
        if (when.getTime() <= now.getTime()) return;
        reg.active?.postMessage({
          type: "schedule-notification",
          title,
          body,
          when: when.toISOString(),
          tag,
        });
      };

      for (const r of routines) {
        schedule(
          r.title,
          `Starts in ${lead} min` +
            (r.description ? ` · ${r.description}` : ""),
          r.start_time,
          `routine-${r.id}`
        );
      }
      for (const e of events) {
        schedule(
          e.title,
          `Starts in ${lead} min` +
            (e.location ? ` · ${e.location}` : ""),
          e.start_time,
          `event-${e.id}`
        );
      }
    }

    scheduleAll();
    const interval = setInterval(scheduleAll, 15 * 60 * 1000);
    const onChange = () => scheduleAll();
    window.addEventListener("dt-change", onChange);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("dt-change", onChange);
    };
  }, []);

  return null;
}
