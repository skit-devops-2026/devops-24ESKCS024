import type { Complaint } from "./complaints";

export type ComplaintFilters = {
  search?: string;
  category?: string;
  status?: string;
  block?: string;
};

/** Filter complaints by free-text search plus optional category/status/block. */
export function filterComplaints(items: Complaint[], filters: ComplaintFilters): Complaint[] {
  const q = (filters.search ?? "").trim().toLowerCase();
  return items.filter((c) => {
    if (q && !`${c.title} ${c.description}`.toLowerCase().includes(q)) return false;
    if (filters.category && filters.category !== "all" && c.category !== filters.category)
      return false;
    if (filters.status && filters.status !== "all" && c.status !== filters.status) return false;
    if (filters.block && filters.block !== "all" && c.hostel_block !== filters.block) return false;
    return true;
  });
}

export type ComplaintStats = {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
  resolutionRate: number;
};

/** Aggregate counts and the percentage of complaints that are resolved. */
export function computeStats(items: Complaint[]): ComplaintStats {
  const stats: ComplaintStats = {
    total: items.length,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0,
    resolutionRate: 0,
  };
  const counts = stats as unknown as Record<string, number>;
  for (const c of items) {
    if (typeof counts[c.status] === "number") {
      counts[c.status] = (counts[c.status] ?? 0) + 1;
    }
  }
  stats.resolutionRate = stats.total === 0 ? 0 : Math.round((stats.resolved / stats.total) * 100);
  return stats;
}

/** Group complaints by category value, returning chart-ready rows. */
export function countByCategory(items: Complaint[]): { category: string; count: number }[] {
  const map = new Map<string, number>();
  for (const c of items) map.set(c.category, (map.get(c.category) ?? 0) + 1);
  return [...map.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/** Split a list into pages of `perPage` items (1-indexed page). */
export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const safePage = Math.max(1, Math.floor(page));
  const start = (safePage - 1) * perPage;
  return items.slice(start, start + perPage);
}

/** Storage object path for a complaint image: `{uid}/{name}`. */
export function buildImagePath(userId: string, fileName: string): string {
  const ext = fileName.includes(".") ? fileName.split(".").pop()!.toLowerCase() : "jpg";
  return `${userId}/${crypto.randomUUID()}.${ext}`;
}
