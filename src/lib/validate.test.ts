import { describe, expect, it } from "vitest";
import { normalizeEmail, normalizeUrl } from "./validate";

describe("normalizeUrl", () => {
  it("keeps valid http(s) links", () => {
    expect(normalizeUrl("https://example.com/a")).toBe("https://example.com/a");
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
  });

  it("adds https when the scheme is missing", () => {
    expect(normalizeUrl("example.com/demo")).toBe("https://example.com/demo");
  });

  it("rejects blank, non-http and malformed input", () => {
    expect(normalizeUrl("")).toBeNull();
    expect(normalizeUrl(null)).toBeNull();
    expect(normalizeUrl(undefined)).toBeNull();
    expect(normalizeUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeUrl("ftp://example.com")).toBeNull();
    expect(normalizeUrl("::::")).toBeNull();
  });
});

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Gov@Example.gov.in ")).toBe("gov@example.gov.in");
    expect(normalizeEmail(null)).toBe("");
  });
});
