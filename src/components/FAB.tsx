"use client";

import { Plus } from "lucide-react";

export default function FAB({
  onClick,
  label = "Add",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-20 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95"
      style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
      aria-label={label}
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  );
}
