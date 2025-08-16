import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

/**
 * Inicializa y retorna la conexión a la base de datos SQLite.
 * Se asegura de crear las tablas si no existen.
 */
export async function initDB(): Promise<Database> {
  const db = await open({
    filename: path.join(__dirname, 'data.db'),
    driver: sqlite3.Database
  });

  // Crear tabla de usuarios
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      uuid TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT,
      role TEXT NOT NULL,
      rafflePoints INTEGER DEFAULT 0
    )
  `);

  // Crear tabla de salas
  await db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      uuid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL
    )
  `);

  // Crear tabla de opciones de menú/tab
  await db.run(`
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
}
