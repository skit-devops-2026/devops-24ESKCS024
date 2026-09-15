import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, LogOut, Save, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { HOSTEL_BLOCKS } from "@/lib/complaints";
import { PageShell, PageHeading } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My profile — HostelFix" },
      {
        name: "description",
        content: "Update your hostel room, block and contact details so wardens can reach you.",
      },
      { property: "og:title", content: "My profile — HostelFix" },
      {
        property: "og:description",
        content: "Manage your HostelFix account details and hostel room information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, isAdmin, refreshProfile, signOut } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    roomNumber: "",
    hostelBlock: "",
    phone: "",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      fullName: profile.name ?? "",
      roomNumber: profile.room_number ?? "",
      hostelBlock: profile.hostel_block ?? "",
      phone: profile.phone ?? "",
    });
  }, [profile]);

  const save = async () => {
    if (!user) return;
    if (form.fullName.trim().length < 2) {
      toast.error("Please enter your full name");
      return;
    }
    if (form.phone && !/^[0-9+\-\s]{7,20}$/.test(form.phone.trim())) {
      toast.error("Enter a valid phone number");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: form.fullName.trim(),
        room_number: form.roomNumber.trim() || null,
        hostel_block: form.hostelBlock || null,
        phone: form.phone.trim() || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshProfile();
    toast.success("Profile saved");
  };

  const initials = (form.fullName || user?.email || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <PageShell className="max-w-3xl">
      <PageHeading title="My profile" subtitle="Keep your details current for faster fixes." />

      <div className="glass space-y-6 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xl font-bold text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{form.fullName || "Unnamed"}</p>
            <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="size-3.5" />
              {isAdmin ? "Administrator" : "Student"}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              maxLength={80}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              maxLength={20}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Hostel block</Label>
            <Select
              value={form.hostelBlock}
              onValueChange={(v) => setForm({ ...form, hostelBlock: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select block" />
              </SelectTrigger>
              <SelectContent>
                {HOSTEL_BLOCKS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="room">Room number</Label>
            <Input
              id="room"
              maxLength={20}
              value={form.roomNumber}
              onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save profile
          </Button>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
