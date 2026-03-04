import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'cards.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_number INTEGER UNIQUE,
    name TEXT NOT NULL,
    group_name TEXT,
    element TEXT,
    legend TEXT,
    general_meaning TEXT,
    work TEXT,
    finance TEXT,
    love TEXT,
    health TEXT,
    merit TEXT,
    visual_key TEXT,
    deep_meaning TEXT,
    occult TEXT,
    image_url TEXT
  );
`);

export default db;
