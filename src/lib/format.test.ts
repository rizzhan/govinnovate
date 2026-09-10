import { describe, expect, it } from "vitest";
import {
  applicationStatusLabels,
  challengeStatusLabels,
  formatDate,
  formatINR,
  milestoneStatusLabels,
  pilotStatusLabels,
  scaleDecisionLabels,
} from "./format";

describe("formatINR", () => {
  it("formats Indian digit grouping", () => {
    expect(formatINR(5000000)).toBe("₹50,00,000");
    expect(formatINR(1500000)).toBe("₹15,00,000");
    expect(formatINR(0)).toBe("₹0");
  });

  it("treats null/undefined as zero", () => {
    expect(formatINR(null)).toBe("₹0");
    expect(formatINR(undefined)).toBe("₹0");
  });
});

describe("formatDate", () => {
  it("formats ISO dates in en-IN style", () => {
    expect(formatDate("2026-04-10")).toBe("10 Apr 2026");
  });

  it("passes through blank and invalid input", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});

describe("status labels", () => {
  it("covers every challenge lifecycle state", () => {
    for (const s of ["draft", "open", "evaluate", "piloting", "scaling", "completed"]) {
      expect(challengeStatusLabels[s]?.label).toBeTruthy();
      expect(challengeStatusLabels[s]?.tone).toBeTruthy();
    }
  });

  it("covers application, pilot, milestone and scale-decision states", () => {
    for (const s of ["submitted", "shortlisted", "rejected", "selected", "withdrawn"]) {
      expect(applicationStatusLabels[s]).toBeTruthy();
    }
    for (const s of ["design", "active", "paused", "completed", "scaling"]) {
      expect(pilotStatusLabels[s]).toBeTruthy();
    }
    for (const s of ["pending", "verified", "paid"]) {
      expect(milestoneStatusLabels[s]).toBeTruthy();
    }
    expect(scaleDecisionLabels["in_progress"]).toBe("In progress");
    expect(scaleDecisionLabels["scale"]).toBe("Scale up");
  });
});
