import bcrypt from "bcrypt";
import { DB } from "./src/db/mockDB";
import { initDB } from "./src/db/db";

export async function seedDatabase() {
  const db = await initDB();

  // 🔥 Borrar todas las tablas si existen
  await db.exec(`
    DROP TABLE IF EXISTS attendance;
    DROP TABLE IF EXISTS schedules;
    DROP TABLE IF EXISTS userBadges;
    DROP TABLE IF EXISTS badges;
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

    CREATE TABLE schedules (
      uuid TEXT PRIMARY KEY,
      userUuid TEXT NOT NULL,
      dayOfWeek INTEGER NOT NULL,
      startTime TEXT NOT NULL, -- formato HH:mm
      endTime TEXT NOT NULL,
      FOREIGN KEY (userUuid) REFERENCES users(uuid)
    );

    CREATE TABLE attendance (
      uuid TEXT PRIMARY KEY,
      userUuid TEXT NOT NULL,
      date TEXT NOT NULL,        -- YYYY-MM-DD
      clockIn TEXT NOT NULL,     -- ISO string
      clockOut TEXT,             -- ISO string o NULL
      FOREIGN KEY (userUuid) REFERENCES users(uuid)
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

  // Insertar schedules
  if (DB.schedules) {
    for (const s of DB.schedules) {
      await db.run(
        `INSERT INTO schedules (uuid, userUuid, dayOfWeek, startTime, endTime)
         VALUES (?, ?, ?, ?, ?)`,
        [s.uuid, s.userUuid, s.dayOfWeek, s.startTime, s.endTime]
      );
    }
  }

  // Insertar attendance
  if (DB.attendance) {
    for (const a of DB.attendance) {
      await db.run(
        `INSERT INTO attendance (uuid, userUuid, date, clockIn, clockOut)
         VALUES (?, ?, ?, ?, ?)`,
        [
          a.uuid,
          a.userUuid,
          a.date,
          a.clockIn.toISOString(),
          a.clockOut ? a.clockOut.toISOString() : null,
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
