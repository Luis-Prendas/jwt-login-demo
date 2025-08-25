import bcrypt from "bcrypt";
import { initDB } from "./src/db/db";
import { DB } from "./src/db/mockDB";

export async function seedDatabase() {
  const db = await initDB();

  // 🔥 Borrar todas las tablas si existen
  await db.exec(`
    DROP TABLE IF EXISTS user;
    DROP TABLE IF EXISTS badge;
    DROP TABLE IF EXISTS userBadge;
    DROP TABLE IF EXISTS schedule;
    DROP TABLE IF EXISTS attendance;
  `);

  // 🔨 Crear todas las tablas de nuevo
  await db.exec(`
    CREATE TABLE user (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      nickname TEXT NOT NULL,
      role TEXT NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      isDeleted INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE badge (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      isDeleted INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE userBadge (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      badgeId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES user(id),
      FOREIGN KEY (badgeId) REFERENCES badge(id)
    );

    CREATE TABLE schedule (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      dayOfWeek INTEGER NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES user(id)
    );

    CREATE TABLE attendance (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      scheduleId TEXT NOT NULL,
      dayOfWeek INTEGER NOT NULL,
      date TEXT NOT NULL,
      clockIn TEXT NOT NULL,
      clockOut TEXT,
      status TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES user(id),
      FOREIGN KEY (scheduleId) REFERENCES schedule(id)
    );
  `);

  const SALT_ROUNDS = 10;

  // Insertar usuarios
  for (const user of DB.users) {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    await db.run(
      `INSERT INTO user (id, email, username, password, nickname, role, description, createdAt, updatedAt, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.email,
        user.username,
        hashedPassword,
        user.nickname,
        user.role,
        user.description,
        user.createdAt,
        user.updatedAt,
        user.isDeleted,
      ]
    );
  }

  // Insertar badges
  for (const badge of DB.badges) {
    await db.run(
      `INSERT INTO badge (id, label, description, createdAt, updatedAt, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        badge.id,
        badge.label,
        badge.description,
        badge.createdAt,
        badge.updatedAt,
        badge.isDeleted,
      ]
    );
  }

  // Insertar userBadges
  for (const ub of DB.userBadges) {
    await db.run(
      `INSERT INTO userBadge (id, userId, badgeId, createdAt, updatedAt, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        ub.id,
        ub.userId,
        ub.badgeId,
        ub.createdAt,
        ub.updatedAt,
        ub.isDeleted,
      ]
    );
  }

  // Insertar schedules
  if (DB.schedules) {
    for (const s of DB.schedules) {
      await db.run(
        `INSERT INTO schedule (id, userId, dayOfWeek, startTime, endTime, description, createdAt, updatedAt, isDeleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.id,
          s.userId,
          s.dayOfWeek,
          s.startTime,
          s.endTime,
          s.description,
          s.createdAt,
          s.updatedAt,
          s.isDeleted,
        ]
      );
    }
  }

  // Insertar attendance
  if (DB.attendance) {
    for (const a of DB.attendance) {
      await db.run(
        `INSERT INTO attendance (id, userId, scheduleId, dayOfWeek, date, clockIn, clockOut, status, createdAt, updatedAt, isDeleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          a.id,
          a.userId,
          a.scheduleId,
          a.dayOfWeek,
          a.date,
          a.clockIn,
          a.clockOut ? a.clockOut : null,
          a.status,
          a.createdAt,
          a.updatedAt,
          a.isDeleted,
        ]
      );
    }
  }

  console.log("✅ Base de datos recreada e inicializada con datos de ejemplo.");
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error("❌ Error al inicializar la base de datos:", err);
  });
}
