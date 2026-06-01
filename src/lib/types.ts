export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type Routine = {
  id: string;
  title: string;
  description: string | null;
  day_of_week: DayOfWeek | null; // null = every day
  start_time: string; // "HH:MM"
  end_time: string | null;
  color: string;
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:MM"
  end_time: string | null;
  color: string;
  location: string | null;
  created_at: string;
};

export type Task = {
  id: string;
  title: string;
  notes: string | null;
  done: boolean;
  due_date: string | null;
  created_at: string;
};

export type Note = {
  id: string;
  title: string | null;
  content: string;
  date: string; // "YYYY-MM-DD"
  created_at: string;
};

export type TimelineItem = {
  kind: "routine" | "event";
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  color: string;
  location?: string | null;
};

export const COLORS = [
  "#6366f1", // indigo
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
] as const;
