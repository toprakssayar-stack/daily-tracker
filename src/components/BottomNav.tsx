"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Repeat,
  CalendarPlus,
  CheckSquare,
  StickyNote,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/routine", label: "Routine", icon: Repeat },
  { href: "/events", label: "Events", icon: CalendarPlus },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/settings", label: "More", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="sticky bottom-0 left-0 right-0 z-30 border-t border-border bg-bg/95 backdrop-blur safe-bottom"
      style={{ backdropFilter: "blur(12px)" }}
    >
      <ul className="grid grid-cols-6">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[10px] transition-colors",
                  active ? "text-accent" : "text-fg-muted hover:text-fg"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                <span className="leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
