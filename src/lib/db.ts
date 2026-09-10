import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export type Role = "admin" | "government" | "startup" | "evaluator";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "govinnovate.db");

const globalForDb = globalThis as unknown as { __db?: Database.Database };

function createDb(): Database.Database {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export const db = globalForDb.__db ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.__db = db;

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      org TEXT DEFAULT '',
      department TEXT DEFAULT '',
      designation TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS startup_profiles (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      company_name TEXT DEFAULT '',
      cin TEXT DEFAULT '',
      dipit_number TEXT DEFAULT '',
      incorporated_year INTEGER,
      sector TEXT DEFAULT '',
      stage TEXT DEFAULT '',
      funding_raised REAL DEFAULT 0,
      employee_count INTEGER DEFAULT 0,
      website TEXT DEFAULT '',
      pitch TEXT DEFAULT '',
      locations TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      outcome_statement TEXT DEFAULT '',
      department TEXT DEFAULT '',
      sector TEXT DEFAULT '',
      budget_min REAL DEFAULT 0,
      budget_max REAL DEFAULT 0,
      status TEXT DEFAULT 'draft',
      timeline TEXT DEFAULT '',
      status_last_updated TEXT DEFAULT (datetime('now')),
      created_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
      startup_user_id INTEGER NOT NULL REFERENCES users(id),
      solution_summary TEXT DEFAULT '',
      tech_readiness TEXT DEFAULT '',
      differentiator TEXT DEFAULT '',
      ask_amount REAL DEFAULT 0,
      status TEXT DEFAULT 'submitted',
      submitted_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      evaluator_user_id INTEGER NOT NULL REFERENCES users(id),
      innovation_score REAL DEFAULT 0,
      feasibility_score REAL DEFAULT 0,
      impact_score REAL DEFAULT 0,
      scalability_score REAL DEFAULT 0,
      viability_score REAL DEFAULT 0,
      comments TEXT DEFAULT '',
      recommendation TEXT DEFAULT '',
      submitted_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pilots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
      startup_user_id INTEGER NOT NULL REFERENCES users(id),
      application_id INTEGER REFERENCES applications(id),
      title TEXT DEFAULT '',
      budget REAL DEFAULT 0,
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'design',
      ip_clause TEXT DEFAULT '',
      data_clause TEXT DEFAULT '',
      cybersecurity_clause TEXT DEFAULT '',
      risk_clause TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pilot_id INTEGER NOT NULL REFERENCES pilots(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      due_date TEXT,
      amount REAL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      verified_by INTEGER REFERENCES users(id),
      verified_at TEXT,
      paid_at TEXT,
      payment_ref TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS scale_up_decisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pilot_id INTEGER NOT NULL REFERENCES pilots(id) ON DELETE CASCADE,
      decision TEXT DEFAULT 'pending',
      districts TEXT DEFAULT '',
      procurement_pathway TEXT DEFAULT '',
      validation_notes TEXT DEFAULT '',
      decision_by INTEGER REFERENCES users(id),
      decision_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT DEFAULT '',
      content TEXT DEFAULT '',
      icon TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS startup_attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      startup_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      url TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export function destroyDb() {
  if (globalForDb.__db) {
    db.close();
    delete globalForDb.__db;
  }
}
