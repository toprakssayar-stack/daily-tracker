import { ReactNode } from "react";

export default function Header({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur border-b border-border safe-top">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-fg-muted truncate">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
    </header>
  );
}
