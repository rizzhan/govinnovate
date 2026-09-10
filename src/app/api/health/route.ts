import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const bootTime = Date.now();

/** Liveness/readiness probe for load balancers and container orchestration. */
export async function GET() {
  const base = {
    status: "ok" as const,
    time: new Date().toISOString(),
    uptime_s: Math.round((Date.now() - bootTime) / 1000),
    version: process.env.npm_package_version ?? "0.1.0",
  };
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    const migrations = await db.collection("schema_migrations").find({}).sort({ version: -1 }).limit(1).toArray();
    return NextResponse.json({ ...base, db: "up", migration: migrations[0]?.version ?? 0 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ...base, status: "degraded", db: "down", error: message }, { status: 503 });
  }
}
