import { cache } from "react";
import { redirect } from "next/navigation";
import { getDb, type Role, Doc } from "./db";
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
  const db = await getDb();
  const doc = await db.collection<Doc>("users")
    .findOne({ _id: session.userId }, { projection: { password_hash: 0 } });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id, ...rest } as User;
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
