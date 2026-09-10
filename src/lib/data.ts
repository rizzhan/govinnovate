import { db } from "./db";

export type Challenge = {
  id: number;
  title: string;
  description: string;
  outcome_statement: string;
  department: string;
  sector: string;
  budget_min: number;
  budget_max: number;
  status: string;
  timeline: string;
  created_by: number;
  created_at: string;
};

export type Application = {
  id: number;
  challenge_id: number;
  startup_user_id: number;
  solution_summary: string;
  tech_readiness: string;
  differentiator: string;
  ask_amount: number;
  status: string;
  submitted_at: string;
};

export function getChallenges(opts?: { by?: number; status?: string }) {
  let sql = `SELECT * FROM challenges WHERE 1=1`;
  const params: any[] = [];
  if (opts?.by) {
    sql += ` AND created_by = ?`;
    params.push(opts.by);
  }
  if (opts?.status) {
    sql += ` AND status = ?`;
    params.push(opts.status);
  }
  sql += ` ORDER BY id DESC`;
  return db.prepare(sql).all(...params) as Challenge[];
}

export function getChallenge(id: number) {
  return db.prepare("SELECT * FROM challenges WHERE id = ?").get(id) as
    | Challenge
    | undefined;
}

export function getApplications(opts?: { challengeId?: number; startupUserId?: number; status?: string }) {
  let sql = `SELECT a.*, c.title AS challenge_title, u.name AS startup_name, c.department AS department
             FROM applications a
             JOIN challenges c ON c.id = a.challenge_id
             JOIN users u ON u.id = a.startup_user_id
             WHERE 1=1`;
  const params: any[] = [];
  if (opts?.challengeId) {
    sql += ` AND a.challenge_id = ?`;
    params.push(opts.challengeId);
  }
  if (opts?.startupUserId) {
    sql += ` AND a.startup_user_id = ?`;
    params.push(opts.startupUserId);
  }
  if (opts?.status) {
    sql += ` AND a.status = ?`;
    params.push(opts.status);
  }
  sql += ` ORDER BY a.id DESC`;
  return db.prepare(sql).all(...params) as (Application & {
    challenge_title: string;
    startup_name: string;
    department: string;
  })[];
}

export function getApplication(id: number) {
  return db
    .prepare(
      `SELECT a.*, c.title AS challenge_title, c.department AS department,
              u.name AS startup_name, u.email AS startup_email, u.org AS startup_org,
              u.designation AS startup_designation
       FROM applications a
       JOIN challenges c ON c.id = a.challenge_id
       JOIN users u ON u.id = a.startup_user_id
       WHERE a.id = ?`
    )
    .get(id) as
    | (Application & {
        challenge_title: string;
        department: string;
        startup_name: string;
        startup_email: string;
        startup_org: string;
        startup_designation: string;
      })
    | undefined;
}

export function getEvaluationsForApplication(applicationId: number) {
  return db
    .prepare(
      `SELECT e.*, u.name AS evaluator_name, u.org AS evaluator_org
       FROM evaluations e JOIN users u ON u.id = e.evaluator_user_id
       WHERE e.application_id = ?`
    )
    .all(applicationId) as (Record<string, any> & { evaluator_name: string })[];
}

export function getPilots(opts?: { startupUserId?: number; challengeId?: number }) {
  let sql = `SELECT p.*, c.title AS challenge_title, c.department AS department, u.name AS startup_name
             FROM pilots p
             JOIN challenges c ON c.id = p.challenge_id
             JOIN users u ON u.id = p.startup_user_id
             WHERE 1=1`;
  const params: any[] = [];
  if (opts?.startupUserId) {
    sql += ` AND p.startup_user_id = ?`;
    params.push(opts.startupUserId);
  }
  if (opts?.challengeId) {
    sql += ` AND p.challenge_id = ?`;
    params.push(opts.challengeId);
  }
  sql += ` ORDER BY p.id DESC`;
  return db.prepare(sql).all(...params) as (Record<string, any> & {
    challenge_title: string;
    startup_name: string;
  })[];
}

export function getPilot(id: number) {
  return db
    .prepare(
      `SELECT p.*, c.title AS challenge_title, c.department AS department,
              u.name AS startup_name, u.email AS startup_email
       FROM pilots p
       JOIN challenges c ON c.id = p.challenge_id
       JOIN users u ON u.id = p.startup_user_id
       WHERE p.id = ?`
    )
    .get(id) as Record<string, any> | undefined;
}

export function getMilestones(pilotId: number) {
  return db
    .prepare("SELECT * FROM milestones WHERE pilot_id = ? ORDER BY id ASC")
    .all(pilotId) as Record<string, any>[];
}

export function getScaleUpDecision(pilotId: number) {
  return db
    .prepare("SELECT * FROM scale_up_decisions WHERE pilot_id = ? ORDER BY id DESC LIMIT 1")
    .get(pilotId) as Record<string, any> | undefined;
}

export function getStartupProfile(userId: number) {
  return db
    .prepare("SELECT * FROM startup_profiles WHERE user_id = ?")
    .get(userId) as Record<string, any> | undefined;
}

export function getAttachments(startupUserId: number) {
  return db
    .prepare("SELECT * FROM startup_attachments WHERE startup_user_id = ? ORDER BY id ASC")
    .all(startupUserId) as Record<string, any>[];
}

export function getTemplates() {
  return db
    .prepare("SELECT * FROM templates ORDER BY category, id")
    .all() as Record<string, any>[];
}

export function getTemplate(id: number) {
  return db.prepare("SELECT * FROM templates WHERE id = ?").get(id) as
    | Record<string, any>
    | undefined;
}

export function getAllUsers() {
  return db
    .prepare("SELECT id, name, email, role, org, department FROM users ORDER BY id")
    .all() as Record<string, any>[];
}

export function getStats() {
  const challenges = db.prepare("SELECT COUNT(*) c FROM challenges").get() as any;
  const applications = db.prepare("SELECT COUNT(*) c FROM applications").get() as any;
  const pilots = db.prepare("SELECT COUNT(*) c FROM pilots").get() as any;
  const startups = db
    .prepare("SELECT COUNT(*) c FROM users WHERE role='startup'")
    .get() as any;
  const templates = db.prepare("SELECT COUNT(*) c FROM templates").get() as any;
  return {
    challenges: challenges.c,
    applications: applications.c,
    pilots: pilots.c,
    startups: startups.c,
    templates: templates.c,
  };
}
