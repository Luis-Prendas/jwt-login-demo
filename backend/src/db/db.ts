import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

/**
 * Inicializa y retorna la conexión a la base de datos SQLite.
 * Se asegura de crear las tablas si no existen.
 */
export async function initDB(): Promise<Database> {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  return db;
}
