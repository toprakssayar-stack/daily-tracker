"use client";

// Local-only data store. Everything lives in this browser's localStorage.
// No accounts, no backend. Use Settings → Export to back up.

import { useEffect, useState, useCallback } from "react";

const PREFIX = "dt-v1:";

function readRaw<T>(name: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PREFIX + name);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeRaw<T>(name: string, items: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX + name, JSON.stringify(items));
  // Notify other tabs / open hooks in this tab.
  window.dispatchEvent(
    new CustomEvent("dt-change", { detail: { name } })
  );
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const store = {
  list<T>(name: string): T[] {
    return readRaw<T>(name);
  },
  add<T extends { id: string; created_at: string }>(
    name: string,
    item: Omit<T, "id" | "created_at">
  ): T {
    const list = readRaw<T>(name);
    const next = {
      ...item,
      id: newId(),
      created_at: new Date().toISOString(),
    } as T;
    writeRaw(name, [...list, next]);
    return next;
  },
  update<T extends { id: string }>(
    name: string,
    id: string,
    patch: Partial<T>
  ) {
    const list = readRaw<T>(name);
    writeRaw(
      name,
      list.map((x) => (x.id === id ? { ...x, ...patch } : x))
    );
  },
  remove(name: string, id: string) {
    const list = readRaw<{ id: string }>(name);
    writeRaw(
      name,
      list.filter((x) => x.id !== id)
    );
  },
  exportAll(): Record<string, unknown[]> {
    return {
      routines: readRaw("routines"),
      events: readRaw("events"),
      tasks: readRaw("tasks"),
      notes: readRaw("notes"),
    };
  },
  importAll(data: Record<string, unknown[]>) {
    for (const name of ["routines", "events", "tasks", "notes"]) {
      if (Array.isArray(data[name])) {
        writeRaw(name, data[name]);
      }
    }
  },
  clearAll() {
    for (const name of ["routines", "events", "tasks", "notes"]) {
      localStorage.removeItem(PREFIX + name);
      window.dispatchEvent(
        new CustomEvent("dt-change", { detail: { name } })
      );
    }
  },
};

// Reactive hook: re-renders when the named collection changes.
export function useCollection<T>(name: string): [T[], () => void] {
  const [data, setData] = useState<T[]>(() => readRaw<T>(name));

  const reload = useCallback(() => {
    setData(readRaw<T>(name));
  }, [name]);

  useEffect(() => {
    reload();
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.name === name) reload();
    };
    window.addEventListener("dt-change", onChange);
    window.addEventListener("storage", reload);
    return () => {
      window.removeEventListener("dt-change", onChange);
      window.removeEventListener("storage", reload);
    };
  }, [name, reload]);

  return [data, reload];
}
