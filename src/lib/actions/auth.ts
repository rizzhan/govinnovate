"use server";

import { db } from "../db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "../session";

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
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required.", email };
  }

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email) as
    | { id: number; name: string; email: string; password_hash: string; role: string }
    | undefined;

  if (!user) {
    return { error: "No account found with that email.", email };
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return { error: "Incorrect password.", email };
  }

  await createSession(user.id, user.role as any, user.name);
  redirect(getHomeForRole(user.role));
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
