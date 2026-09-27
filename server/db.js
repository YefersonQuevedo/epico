import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const file = resolve(process.env.DB_FILE || 'data/epico.db')
mkdirSync(dirname(file), { recursive: true })

export const db = new DatabaseSync(file)
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;')

db.exec(`
CREATE TABLE IF NOT EXISTS communities (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  parent_id   TEXT REFERENCES communities(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  musical     TEXT NOT NULL,
  city        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  whatsapp    TEXT,
  discord     TEXT,
  instagram   TEXT,
  telegram    TEXT,
  base_members INTEGER NOT NULL DEFAULT 0,
  edit_key_hash TEXT NOT NULL,
  terms_accepted_at TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leaders (
  id           TEXT PRIMARY KEY,
  community_id TEXT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'Líder',
  phone        TEXT,
  email        TEXT,
  public_phone INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS members (
  id           TEXT PRIMARY KEY,
  community_id TEXT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  phone        TEXT,
  email        TEXT,
  consent_at   TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (community_id, phone)
);

CREATE TABLE IF NOT EXISTS events (
  id           TEXT PRIMARY KEY,
  community_id TEXT REFERENCES communities(id) ON DELETE SET NULL,
  musical      TEXT NOT NULL,
  type         TEXT NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  city         TEXT NOT NULL,
  venue        TEXT NOT NULL,
  address      TEXT NOT NULL DEFAULT '',
  lat          REAL,
  lng          REAL,
  date         TEXT NOT NULL,
  time         TEXT NOT NULL,
  price        INTEGER NOT NULL DEFAULT 0,
  capacity     INTEGER NOT NULL,
  sold         INTEGER NOT NULL DEFAULT 0,
  organizer    TEXT NOT NULL,
  contact_phone TEXT,
  whatsapp     TEXT,
  discord      TEXT,
  edit_key_hash TEXT NOT NULL,
  terms_accepted_at TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subtotal    INTEGER NOT NULL,
  fee         INTEGER NOT NULL,
  total       INTEGER NOT NULL,
  method      TEXT NOT NULL,
  payment_ref TEXT,
  status      TEXT NOT NULL,
  consent_at  TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tickets (
  code       TEXT PRIMARY KEY,
  order_id   TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_id   TEXT NOT NULL REFERENCES events(id),
  holder     TEXT NOT NULL,
  price      INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_comm_parent ON communities(parent_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
`)

export function tx(fn) {
  db.exec('BEGIN')
  try {
    const r = fn()
    db.exec('COMMIT')
    return r
  } catch (e) {
    db.exec('ROLLBACK')
    throw e
  }
}
