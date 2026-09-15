import { motion } from "motion/react";
import { Loader2, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10", className)}
    >
      {children}
    </motion.main>
  );
}

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
      <span className="relative grid size-14 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <Loader2 className="size-7 animate-spin text-primary" />
      </span>
      <p className="text-sm">{label}…</p>
    </div>
  );
}

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="glass h-24 animate-pulse rounded-2xl" />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass flex flex-col items-center rounded-3xl px-6 py-16 text-center"
    >
      <span className="float-slow grid size-20 place-items-center rounded-3xl bg-primary/10 text-primary">
        <Inbox className="size-9" />
      </span>
      <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const map: Record<string, string> = {
    pending: "bg-warning/15 text-warning border-warning/30",
    in_progress: "bg-info/15 text-info border-info/30",
    resolved: "bg-success/15 text-success border-success/30",
    rejected: "bg-destructive/15 text-destructive border-destructive/30",
  };
  const labels: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    resolved: "Resolved",
    rejected: "Rejected",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        map[status],
        className,
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
