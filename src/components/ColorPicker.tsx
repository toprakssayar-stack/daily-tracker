"use client";

import { COLORS } from "@/lib/types";

export default function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="w-8 h-8 rounded-full border-2 transition-all"
          style={{
            background: c,
            borderColor: value === c ? "var(--fg)" : "transparent",
            transform: value === c ? "scale(1.1)" : "scale(1)",
          }}
          aria-label={`Color ${c}`}
        />
      ))}
    </div>
  );
}
