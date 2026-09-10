import { describe, expect, it } from "vitest";
import { signSession, verifySession } from "./session-crypto";
import type { Role } from "./db";

const SECRET = "test-secret-for-unit-tests-only";
const WRONG_SECRET = "a-different-secret";

function payload() {
  return { userId: 3, role: "startup" as Role, name: "Rohan Desai" };
}

describe("session crypto", () => {
  it("round-trips a session payload", async () => {
    const token = await signSession(payload(), SECRET);
    const back = await verifySession(token, SECRET);
    expect(back?.userId).toBe(3);
    expect(back?.role).toBe("startup");
    expect(back?.name).toBe("Rohan Desai");
    expect(back?.expiresAt).toBeInstanceOf(Date);
  });

  it("rejects tampered tokens", async () => {
    const token = await signSession(payload(), SECRET);
    const tampered = token.slice(0, -2) + (token.endsWith("aa") ? "bb" : "aa");
    expect(await verifySession(tampered, SECRET)).toBeNull();
  });

  it("rejects tokens signed with another secret", async () => {
    const token = await signSession(payload(), WRONG_SECRET);
    expect(await verifySession(token, SECRET)).toBeNull();
  });

  it("rejects garbage input", async () => {
    expect(await verifySession("", SECRET)).toBeNull();
    expect(await verifySession("not.a.token", SECRET)).toBeNull();
  });

  it("rejects expired tokens", async () => {
    const token = await signSession(payload(), SECRET, "1s");
    await new Promise((r) => setTimeout(r, 1100));
    expect(await verifySession(token, SECRET)).toBeNull();
  });
});
