export function cn(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

export function formatTime(t: string | null): string {
  if (!t) return "";
  // "HH:MM:SS" or "HH:MM"
  const [h, m] = t.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function minutesSinceMidnight(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
