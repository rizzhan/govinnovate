"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getDb, Doc } from "../db";
import { createSession, deleteSession } from "../session";
import { checkLoginLimit } from "../rate-limit-mongo";
import { normalizeEmail } from "../validate";

export type LoginState = {
  error?: string;
  email?: string;
} | undefined;

function getHomeForRole(role: string) {
  switch (role) {
    case "admin":
      return "/admin";
    case "government":
      return "/gov";
    case "evaluator":
      return "/evaluator";
    case "startup":
      return "/startup";
    default:
      return "/";
  }
}

export async function login(_prev: LoginState, formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required.", email };
  }

  // Brute-force protection: per-account window (10 attempts / 10 min).
  // Network-level throttling belongs at the edge (Vercel Firewall,
  // Cloudflare, nginx) in front of multi-instance deployments.
  if (!(await checkLoginLimit(`login:email:${email}`, 10, 10 * 60 * 1000)).ok) {
    return { error: "Too many sign-in attempts for this account. Please try again in a few minutes.", email };
  }

  const db = await getDb();
  const user = (await db.collection<Doc>("users").findOne({ email })) as
    | { _id: number; name: string; email: string; password_hash: string; role: string }
    | null;

  if (!user) {
    return { error: "No account found with that email.", email };
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return { error: "Incorrect password.", email };
  }

  await createSession(user._id, user.role as any, user.name);
  redirect(getHomeForRole(user.role));
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
