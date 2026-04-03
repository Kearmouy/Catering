import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data.db");
export const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    ingredients TEXT NOT NULL,
    tags TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    selectedMenuItems TEXT NOT NULL
  );
`);

// One-time migration for older databases
const menuColumns = db.prepare(`PRAGMA table_info(menu_items)`).all() as {
  name: string;
}[];

const hasCategoryColumn = menuColumns.some((col) => col.name === "category");

if (!hasCategoryColumn) {
  db.exec(`ALTER TABLE menu_items ADD COLUMN category TEXT`);
}