import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  kicker: string;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}

export function AdminPageHeader({
  kicker,
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  actions,
  meta,
}: AdminPageHeaderProps) {
  return (
    <header className="admin-page-header flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {backHref && (
          <Link href={backHref} className="admin-back-link">
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </Link>
        )}
        <span className="admin-page-kicker">{kicker}</span>
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>
      {(actions || meta) && (
        <div className="admin-page-toolbar flex flex-wrap items-center gap-2.5">
          {meta}
          {actions}
        </div>
      )}
    </header>
  );
}
