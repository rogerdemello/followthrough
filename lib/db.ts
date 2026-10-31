import type { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { resetToDemo } from "./seed";

const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS meetings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  held_on TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS decisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meeting_id INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  superseded_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS action_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meeting_id INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  owner TEXT,
  due_on TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  tracker_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conflicts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  new_decision_id INTEGER NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  old_decision_id INTEGER NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  reason TEXT NOT NULL,
  resolution TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS aliases (
  alias TEXT PRIMARY KEY,
  canonical TEXT NOT NULL
);
`;

const g = globalThis as unknown as { __followthroughDb?: DatabaseSync };

// node:sqlite is loaded at runtime so the bundler never tries to resolve it.
export function getDb(): DatabaseSync {
  if (g.__followthroughDb) return g.__followthroughDb;
  const { DatabaseSync: Db } = process.getBuiltinModule("node:sqlite");
  const file = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "followthrough.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Db(file);
  db.exec(SCHEMA);
  g.__followthroughDb = db;

  // On free hosts the disk is wiped on restart. SEED_ON_EMPTY=1 reloads the demo data when that happens.
  if (process.env.SEED_ON_EMPTY === "1") {
    const row = db.prepare("SELECT COUNT(*) AS n FROM meetings").get() as unknown as { n: number };
    if (row.n === 0) resetToDemo(db);
  }
  return db;
}

export function all<T>(sql: string, ...params: (string | number | null)[]): T[] {
  return getDb().prepare(sql).all(...params) as unknown as T[];
}

export function one<T>(sql: string, ...params: (string | number | null)[]): T | undefined {
  return getDb().prepare(sql).get(...params) as unknown as T | undefined;
}
