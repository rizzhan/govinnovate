import { SignJWT, jwtVerify } from "jose";
import type { Role } from "./db";

export type SessionPayload = {
  userId: number;
  role: Role;
  name: string;
  expiresAt: Date;
};

/** Pure JWT helpers (no Next.js runtime) so session crypto is unit-testable. */
export async function signSession(
  payload: { userId: number; role: Role; name: string },
  secret: string,
  expiresIn = "7d"
): Promise<string> {
  const encodedKey = new TextEncoder().encode(secret);
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime(expiresIn).sign(encodedKey);
}

export async function verifySession(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const encodedKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return {
      userId: payload.userId as number,
      role: payload.role as Role,
      name: payload.name as string,
      expiresAt: new Date((payload.exp as number) * 1000),
    };
  } catch {
    return null;
  }
}
