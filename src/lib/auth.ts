import { cache } from "react";
import { redirect } from "next/navigation";
import { db, type Role } from "./db";
import { getSession } from "./session";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  org: string;
  department: string;
  designation: string;
  phone: string;
};

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  org: string;
  department: string;
  designation: string;
};

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const session = await getSession();
  if (!session) return null;
  return {
    id: session.userId,
    name: session.name,
    role: session.role,
    email: "",
    org: "",
    department: "",
    designation: "",
  };
});

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await getSession();
  if (!session) return null;
  const row = db
    .prepare(
      `SELECT id, name, email, role, org, department, designation, phone
       FROM users WHERE id = ?`
    )
    .get(session.userId) as User | undefined;
  return row ?? null;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/");
  return user;
}
