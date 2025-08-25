import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

/**
 * Inicializa y retorna la conexión a la base de datos SQLite.
 */
export async function initDB(): Promise<Database> {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  return db;
}
