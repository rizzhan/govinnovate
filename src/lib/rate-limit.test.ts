import { beforeEach, describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimits } from "./rate-limit";

describe("rate limiter", () => {
  beforeEach(() => resetRateLimits());

  it("allows requests under the limit", () => {
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit("k", 10, 60000, 1000 + i).ok).toBe(true);
    }
  });

  it("blocks past the limit and reports retry delay", () => {
    const t = 5000;
    for (let i = 0; i < 3; i++) checkRateLimit("k", 3, 60000, t);
    const blocked = checkRateLimit("k", 3, 60000, t + 1);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("resets when the window passes", () => {
    checkRateLimit("k", 1, 1000, 0);
    expect(checkRateLimit("k", 1, 1000, 500).ok).toBe(false);
    expect(checkRateLimit("k", 1, 1000, 1001).ok).toBe(true);
  });

  it("tracks keys independently", () => {
    checkRateLimit("a", 1, 60000, 0);
    expect(checkRateLimit("b", 1, 60000, 0).ok).toBe(true);
    expect(checkRateLimit("a", 1, 60000, 0).ok).toBe(false);
  });
});
