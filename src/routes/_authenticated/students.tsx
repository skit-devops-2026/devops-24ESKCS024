import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Mail, Phone, DoorOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { HOSTEL_BLOCKS } from "@/lib/complaints";
import { PageShell, PageHeading, SkeletonList, EmptyState } from "@/components/ui-kit";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/students")({
  head: () => ({
    meta: [
      { title: "Students directory — HostelFix" },
      {
        name: "description",
        content: "Admin directory of hostel residents with rooms, blocks and complaint counts.",
      },
      { property: "og:title", content: "Students directory — HostelFix" },
      {
        property: "og:description",
        content: "Browse hostel residents by block and room, and see who raised what.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentsPage,
});

type Row = {
  id: string;
  name: string;
  email: string;
  room_number: string | null;
  hostel_block: string | null;
  phone: string | null;
};

function StudentsPage() {
  const { isAdmin } = useAuth();
  const [q, setQ] = useState("");
  const [block, setBlock] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["students"],
    enabled: isAdmin,
    queryFn: async () => {
      const [{ data: profiles, error }, { data: complaints }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id,name,email,room_number,hostel_block,phone")
          .order("name"),
        supabase.from("complaints").select("student_id"),
      ]);
      if (error) throw error;
      const counts = new Map<string, number>();
      (complaints ?? []).forEach((c) => {
        counts.set(c.student_id, (counts.get(c.student_id) ?? 0) + 1);
      });
      return { rows: (profiles ?? []) as Row[], counts };
    },
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data?.rows ?? []).filter((r) => {
      if (block !== "all" && r.hostel_block !== block) return false;
      if (term && !`${r.name} ${r.email} ${r.room_number ?? ""}`.toLowerCase().includes(term))
        return false;
      return true;
    });
  }, [data, q, block]);

  if (!isAdmin) {
    return (
      <PageShell className="max-w-2xl">
        <EmptyState
          title="Admins only"
          description="The student directory is available to hostel administrators."
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeading
        title="Students"
        subtitle={`${filtered.length} resident${filtered.length === 1 ? "" : "s"} registered`}
      />

      <div className="glass mb-6 grid gap-3 rounded-2xl p-4 sm:grid-cols-[minmax(0,1fr)_200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            maxLength={100}
            placeholder="Search by name, email or room…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={block} onValueChange={setBlock}>
          <SelectTrigger>
            <SelectValue placeholder="Block" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All blocks</SelectItem>
            {HOSTEL_BLOCKS.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <SkeletonList />
      ) : filtered.length === 0 ? (
        <EmptyState title="No students found" description="Try a different search or block." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 8) * 0.04 }}
              className="glass rounded-2xl p-5"
            >
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent font-semibold text-primary-foreground">
                  {r.name?.slice(0, 2).toUpperCase() || "?"}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{r.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {data?.counts.get(r.id) ?? 0} complaint
                    {(data?.counts.get(r.id) ?? 0) === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <dl className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <div className="flex min-w-0 items-center gap-2">
                  <Mail className="size-4 shrink-0" />
                  <span className="truncate">{r.email}</span>
                </div>
                {r.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0" />
                    <span className="truncate">{r.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <DoorOpen className="size-4 shrink-0" />
                  <span className="truncate">
                    {r.hostel_block ?? "No block"}
                    {r.room_number ? ` · Room ${r.room_number}` : ""}
                  </span>
                </div>
              </dl>
            </motion.article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
