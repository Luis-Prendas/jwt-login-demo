import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const initDB = async () => {
  const db = await open({
    filename: "./data.db",
    driver: sqlite3.Database,
  });

  // Tabla de usuarios
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      uuid TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT,
      role TEXT,
      rafflePoints INTEGER DEFAULT 0
    )
  `);

  // Tabla de rooms
  await db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      uuid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL
    )
  `);

  // Tabla de opciones del menú
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tabsMenuOptions (
      uuid TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      icon TEXT NOT NULL,
      route TEXT NOT NULL,
      authRequired INTEGER NOT NULL,
      "order" INTEGER NOT NULL,
      rolesAllowed TEXT NOT NULL
    )
  `);

  return db;
};
