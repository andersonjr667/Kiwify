const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "..", "data", "database.sqlite");
let db;

const initDatabase = () => {
  if (!db) {
    db = new Database(dbPath);
  }

  db.pragma("foreign_keys = ON");

  db.prepare(
    `CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      produto TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS form_responses (
      order_id TEXT PRIMARY KEY,
      respostas TEXT NOT NULL,
      submitted_at TEXT NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(order_id) ON DELETE CASCADE
    )`
  ).run();
};

const getDb = () => {
  if (!db) {
    initDatabase();
  }
  return db;
};

module.exports = {
  initDatabase,
  getDb
};
