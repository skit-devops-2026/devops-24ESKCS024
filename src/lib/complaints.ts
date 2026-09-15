import {
  Zap,
  Droplets,
  Wifi,
  Armchair,
  Sparkles,
  GlassWater,
  CircleEllipsis,
  type LucideIcon,
} from "lucide-react";

export const CATEGORIES = [
  { value: "electrical", label: "Electrical", icon: Zap },
  { value: "plumbing", label: "Plumbing", icon: Droplets },
  { value: "internet", label: "Internet / WiFi", icon: Wifi },
  { value: "furniture", label: "Furniture", icon: Armchair },
  { value: "cleanliness", label: "Cleanliness", icon: Sparkles },
  { value: "water", label: "Water", icon: GlassWater },
  { value: "other", label: "Other", icon: CircleEllipsis },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const CATEGORY_MAP: Record<string, { label: string; icon: LucideIcon }> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, { label: c.label, icon: c.icon }]),
);

export const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
] as const;

export type StatusValue = (typeof STATUSES)[number]["value"];

export const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  STATUSES.map((s) => [s.value, s.label]),
);

export const STATUS_CLASS: Record<string, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  in_progress: "bg-info/15 text-info border-info/30",
  resolved: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export const HOSTEL_BLOCKS = ["Block A", "Block B", "Block C", "Block D", "Block E"];

export type Complaint = {
  id: string;
  student_id: string;
  title: string;
  description: string;
  category: string;
  hostel_block: string | null;
  room_number: string | null;
  image_path: string | null;
  status: string;
  remarks: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};
