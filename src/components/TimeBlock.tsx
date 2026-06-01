"use client";

import { ReactNode } from "react";
import { Clock, MapPin, Repeat as RepeatIcon, Calendar } from "lucide-react";
import { formatTime } from "@/lib/utils";

export default function TimeBlock({
  title,
  start,
  end,
  description,
  color,
  kind,
  location,
  onClick,
  rightAction,
}: {
  title: string;
  start: string;
  end?: string | null;
  description?: string | null;
  color: string;
  kind?: "routine" | "event";
  location?: string | null;
  onClick?: () => void;
  rightAction?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card w-full text-left flex gap-3 hover:bg-bg-elev-2 transition-colors"
    >
      <div
        className="w-1.5 rounded-full shrink-0"
        style={{ background: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium truncate">{title}</h3>
          {kind && (
            <span className="text-[10px] uppercase tracking-wide text-fg-muted shrink-0 flex items-center gap-1">
              {kind === "routine" ? (
                <RepeatIcon size={11} />
              ) : (
                <Calendar size={11} />
              )}
              {kind}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-fg-muted mt-0.5">
          <Clock size={12} />
          <span>
            {formatTime(start)}
            {end ? ` – ${formatTime(end)}` : ""}
          </span>
          {location && (
            <>
              <span className="mx-1">•</span>
              <MapPin size={12} />
              <span className="truncate">{location}</span>
            </>
          )}
        </div>
        {description && (
          <p className="text-sm text-fg-muted mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </button>
  );
}
