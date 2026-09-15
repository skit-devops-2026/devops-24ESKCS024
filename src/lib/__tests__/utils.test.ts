import { describe, expect, it } from "vitest";
import { cn } from "../utils";
import { CATEGORIES, CATEGORY_MAP, STATUSES, STATUS_LABEL } from "../complaints";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("p-2", "text-sm")).toBe("p-2 text-sm");
  });

  it("lets later tailwind classes win", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("skips falsy values", () => {
    expect(cn("p-2", false && "hidden", undefined)).toBe("p-2");
  });
});

describe("domain constants", () => {
  it("maps every category to a label and icon", () => {
    for (const c of CATEGORIES) {
      expect(CATEGORY_MAP[c.value]?.label).toBe(c.label);
      expect(CATEGORY_MAP[c.value]?.icon).toBeTruthy();
    }
  });

  it("exposes the four complaint statuses", () => {
    expect(STATUSES.map((s) => s.value)).toEqual([
      "pending",
      "in_progress",
      "resolved",
      "rejected",
    ]);
    expect(STATUS_LABEL["in_progress"]).toBe("In Progress");
  });
});
