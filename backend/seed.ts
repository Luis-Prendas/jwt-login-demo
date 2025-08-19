// src/db/db.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import { DB } from "./src/db/mockDB";
import { initDB } from "./src/db/db";

/**
 * Seed de la base de datos con reset total.
 * Borra tablas y las recrea antes de insertar los datos iniciales.
 */
export async function seedDatabase() {
  const db = await initDB();

  // 🔥 Borrar todas las tablas si existen
  await db.exec(`
    DROP TABLE IF EXISTS userBadges;
    DROP TABLE IF EXISTS badges;
    DROP TABLE IF EXISTS tabsMenuOptions;
    DROP TABLE IF EXISTS rooms;
    DROP TABLE IF EXISTS users;
  `);

  // 🔨 Crear todas las tablas de nuevo
  await db.exec(`
    CREATE TABLE users (
      uuid TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      nickname TEXT NOT NULL,
      role TEXT NOT NULL
    );

    CREATE TABLE rooms (
      uuid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL
    );

    CREATE TABLE tabsMenuOptions (
      uuid TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      icon TEXT NOT NULL,
      route TEXT NOT NULL,
      authRequired INTEGER NOT NULL,
      "order" INTEGER NOT NULL,
      rolesAllowed TEXT NOT NULL -- JSON
    );

    CREATE TABLE badges (
      uuid TEXT PRIMARY KEY,
      label TEXT NOT NULL
    );

    CREATE TABLE userBadges (
      uuid TEXT PRIMARY KEY,
      userUuid TEXT NOT NULL,
      badgeUuid TEXT NOT NULL,
      FOREIGN KEY (userUuid) REFERENCES users(uuid),
      FOREIGN KEY (badgeUuid) REFERENCES badges(uuid)
    );
  `);

  const SALT_ROUNDS = 10;

  // Insertar usuarios
  for (const user of DB.users) {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    await db.run(
      `INSERT INTO users (uuid, email, username, password, nickname, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user.uuid,
        user.email,
        user.username,
        hashedPassword,
        user.nickname,
        user.role,
      ]
    );
  }

  // Insertar salas
  for (const room of DB.rooms) {
    await db.run(
      `INSERT INTO rooms (uuid, name, capacity)
       VALUES (?, ?, ?)`,
      [room.uuid, room.name, room.capacity]
    );
  }

  // Insertar tabs
  for (const tab of DB.tabsMenuOptions) {
    await db.run(
      `INSERT INTO tabsMenuOptions 
       (uuid, label, icon, route, authRequired, "order", rolesAllowed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        tab.uuid,
        tab.label,
        tab.icon,
        tab.route,
        tab.authRequired ? 1 : 0,
        tab.order,
        JSON.stringify(tab.rolesAllowed),
      ]
    );
  }

  // Insertar badges
  for (const badge of DB.badges) {
    await db.run(
      `INSERT INTO badges (uuid, label)
       VALUES (?, ?)`,
      [badge.uuid, badge.label]
    );
  }

  // Insertar userBadges
  for (const ub of DB.userBadges) {
    await db.run(
      `INSERT INTO userBadges (uuid, userUuid, badgeUuid)
       VALUES (?, ?, ?)`,
      [ub.uuid, ub.userUuid, ub.badgeUuid]
    );
  }

  console.log("✅ Base de datos recreada e inicializada con datos de ejemplo.");
}

// Ejecutar automáticamente si se corre este archivo
if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error("❌ Error al inicializar la base de datos:", err);
  });
}
