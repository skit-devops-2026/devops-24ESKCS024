import { describe, expect, it } from "vitest";
import {
  buildImagePath,
  computeStats,
  countByCategory,
  filterComplaints,
  paginate,
} from "../complaint-utils";
import type { Complaint } from "../complaints";

const base: Complaint = {
  id: "1",
  student_id: "s1",
  title: "Fan not working",
  description: "Ceiling fan stopped spinning",
  category: "electrical",
  hostel_block: "Block A",
  room_number: "101",
  image_path: null,
  status: "pending",
  remarks: null,
  assigned_to: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const make = (over: Partial<Complaint>): Complaint => ({
  ...base,
  description: "Reported by student",
  ...over,
});

const items: Complaint[] = [
  base,
  make({ id: "2", title: "Tap leaking", category: "plumbing", status: "resolved" }),
  make({ id: "3", title: "Slow WiFi", category: "internet", hostel_block: "Block B" }),
  make({ id: "4", title: "Broken chair", category: "furniture", status: "resolved" }),
];

describe("filterComplaints", () => {
  it("returns everything when no filters are given", () => {
    expect(filterComplaints(items, {})).toHaveLength(4);
  });

  it("matches title and description case-insensitively", () => {
    expect(filterComplaints(items, { search: "wifi" }).map((c) => c.id)).toEqual(["3"]);
    expect(filterComplaints(items, { search: "ceiling" }).map((c) => c.id)).toEqual(["1"]);
  });

  it("filters by category, status and block", () => {
    expect(filterComplaints(items, { category: "plumbing" })).toHaveLength(1);
    expect(filterComplaints(items, { status: "resolved" })).toHaveLength(2);
    expect(filterComplaints(items, { block: "Block B" })).toHaveLength(1);
  });

  it("treats 'all' as no filter", () => {
    expect(filterComplaints(items, { category: "all", status: "all", block: "all" })).toHaveLength(
      4,
    );
  });
});

describe("computeStats", () => {
  it("counts statuses and resolution rate", () => {
    const s = computeStats(items);
    expect(s.total).toBe(4);
    expect(s.pending).toBe(2);
    expect(s.resolved).toBe(2);
    expect(s.resolutionRate).toBe(50);
  });

  it("handles an empty list without dividing by zero", () => {
    expect(computeStats([]).resolutionRate).toBe(0);
  });
});

describe("countByCategory", () => {
  it("groups and sorts by count descending", () => {
    const rows = countByCategory([...items, make({ id: "5", category: "plumbing" })]);
    expect(rows[0]).toEqual({ category: "plumbing", count: 2 });
    expect(rows).toHaveLength(4);
  });
});

describe("paginate", () => {
  it("slices pages of the requested size", () => {
    expect(paginate(items, 1, 2).map((c) => c.id)).toEqual(["1", "2"]);
    expect(paginate(items, 2, 2).map((c) => c.id)).toEqual(["3", "4"]);
    expect(paginate(items, 9, 2)).toEqual([]);
  });

  it("clamps invalid page numbers to the first page", () => {
    expect(paginate(items, 0, 2).map((c) => c.id)).toEqual(["1", "2"]);
  });
});

describe("buildImagePath", () => {
  it("scopes the file to the user folder and keeps the extension", () => {
    const path = buildImagePath("user-1", "photo.PNG");
    expect(path.startsWith("user-1/")).toBe(true);
    expect(path.endsWith(".png")).toBe(true);
  });

  it("falls back to jpg when there is no extension", () => {
    expect(buildImagePath("user-1", "photo").endsWith(".jpg")).toBe(true);
  });
});
