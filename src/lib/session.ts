import { cookies } from "next/headers";
import type { Role } from "./db";
import { getSessionSecret } from "./env";
import { signSession, verifySession, type SessionPayload } from "./session-crypto";

export type { SessionPayload };

export async function createSession(userId: number, role: Role, name: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await signSession({ userId, role, name }, getSessionSecret(), "7d");

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return verifySession(session, getSessionSecret());
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
