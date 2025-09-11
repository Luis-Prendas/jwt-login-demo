import bcrypt from "bcrypt";
import { initDB } from "./src/db/db";
import { DB } from "./src/db/mockDB";

async function seedDatabase() {
  const db = await initDB();

  // 🔥 Borrar todas las tablas si existen
  await db.exec(`
    DROP TABLE IF EXISTS auditLog;
    DROP TABLE IF EXISTS attendance;
    DROP TABLE IF EXISTS schedule;
    DROP TABLE IF EXISTS userPosition;
    DROP TABLE IF EXISTS position;
    DROP TABLE IF EXISTS department;
    DROP TABLE IF EXISTS user;
    DROP TABLE IF EXISTS organization;
  `);

  // 🔨 Crear todas las tablas de nuevo
  await db.exec(`
    CREATE TABLE organization (
      id TEXT PRIMARY KEY,
      corporateName TEXT NOT NULL,
      displayName TEXT NOT NULL,
      organizationCode TEXT NOT NULL,
      logoUrl TEXT,
      slogan TEXT,
      description TEXT,
      createdAt TEXT NOT NULL,
      createdBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      updatedBy TEXT NOT NULL,
      deletedAt TEXT,
      deletedBy TEXT,
      isDeleted INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE department (
      id TEXT PRIMARY KEY,
      organizationId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL,
      createdBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      updatedBy TEXT NOT NULL,
      deletedAt TEXT,
      deletedBy TEXT,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (organizationId) REFERENCES organization(id)
    );

    CREATE TABLE position (
      id TEXT PRIMARY KEY,
      departmentId TEXT NOT NULL,
      maleName TEXT NOT NULL,
      femaleName TEXT NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL,
      createdBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      updatedBy TEXT NOT NULL,
      deletedAt TEXT,
      deletedBy TEXT,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (departmentId) REFERENCES department(id)
    );

    CREATE TABLE user (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      nickname TEXT NOT NULL,
      name TEXT NOT NULL,
      lastName TEXT NOT NULL,
      phone TEXT,
      gender TEXT NOT NULL,
      birthDate TEXT,
      indentificationNumber TEXT,
      address TEXT,
      role TEXT NOT NULL,
      description TEXT,
      organizationId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      createdBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      updatedBy TEXT NOT NULL,
      deletedAt TEXT,
      deletedBy TEXT,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (organizationId) REFERENCES organization(id)
    );

    CREATE TABLE userPosition (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      positionId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      createdBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      updatedBy TEXT NOT NULL,
      deletedAt TEXT,
      deletedBy TEXT,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES user(id),
      FOREIGN KEY (positionId) REFERENCES position(id)
    );

    CREATE TABLE schedule (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      dayOfWeek INTEGER NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL,
      createdBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      updatedBy TEXT NOT NULL,
      deletedAt TEXT,
      deletedBy TEXT,
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
      createdBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      updatedBy TEXT NOT NULL,
      deletedAt TEXT,
      deletedBy TEXT,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES user(id),
      FOREIGN KEY (scheduleId) REFERENCES schedule(id)
    );

    CREATE TABLE auditLog (
      id TEXT PRIMARY KEY,
      tableName TEXT NOT NULL,
      recordId TEXT NOT NULL,
      action TEXT NOT NULL,
      changes TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      createdBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      updatedBy TEXT NOT NULL,
      deletedAt TEXT,
      deletedBy TEXT,
      isDeleted INTEGER NOT NULL DEFAULT 0
    );
  `);

  const SALT_ROUNDS = 10;

  // Insertar organizaciones
  for (const org of DB.organizations) {
    await db.run(
      `INSERT INTO organization (id, corporateName, displayName, organizationCode, logoUrl, slogan, description, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        org.id,
        org.corporateName,
        org.displayName,
        org.organizationCode,
        org.logoUrl,
        org.slogan,
        org.description,
        org.createdAt,
        org.createdBy,
        org.updatedAt,
        org.updatedBy,
        org.deletedAt,
        org.deletedBy,
        org.isDeleted,
      ]
    );
  }

  // Insertar departamentos
  for (const dep of DB.departments) {
    await db.run(
      `INSERT INTO department (id, organizationId, name, description, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dep.id,
        dep.organizationId,
        dep.name,
        dep.description,
        dep.createdAt,
        dep.createdBy,
        dep.updatedAt,
        dep.updatedBy,
        dep.deletedAt,
        dep.deletedBy,
        dep.isDeleted,
      ]
    );
  }

  // Insertar posiciones
  for (const pos of DB.positions) {
    await db.run(
      `INSERT INTO position (id, departmentId, maleName, femaleName, description, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pos.id,
        pos.departmentId,
        pos.maleName,
        pos.femaleName,
        pos.description,
        pos.createdAt,
        pos.createdBy,
        pos.updatedAt,
        pos.updatedBy,
        pos.deletedAt,
        pos.deletedBy,
        pos.isDeleted,
      ]
    );
  }

  // Insertar usuarios
  for (const user of DB.users) {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    await db.run(
      `INSERT INTO user (id, email, username, password, nickname, name, lastName, phone, gender, birthDate, indentificationNumber, address, role, description, organizationId, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.email,
        user.username,
        hashedPassword,
        user.nickname,
        user.name,
        user.lastName,
        user.phone,
        user.gender,
        user.birthDate,
        user.indentificationNumber,
        user.address,
        user.role,
        user.description,
        user.organizationId,
        user.createdAt,
        user.createdBy,
        user.updatedAt,
        user.updatedBy,
        user.deletedAt,
        user.deletedBy,
        user.isDeleted,
      ]
    );
  }

  // Insertar userPositions
  for (const up of DB.userPositions) {
    await db.run(
      `INSERT INTO userPosition (id, userId, positionId, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        up.id,
        up.userId,
        up.positionId,
        up.createdAt,
        up.createdBy,
        up.updatedAt,
        up.updatedBy,
        up.deletedAt,
        up.deletedBy,
        up.isDeleted,
      ]
    );
  }

  // Insertar schedules
  for (const s of DB.schedules) {
    await db.run(
      `INSERT INTO schedule (id, userId, dayOfWeek, startTime, endTime, description, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        s.id,
        s.userId,
        s.dayOfWeek,
        s.startTime,
        s.endTime,
        s.description,
        s.createdAt,
        s.createdBy,
        s.updatedAt,
        s.updatedBy,
        s.deletedAt,
        s.deletedBy,
        s.isDeleted,
      ]
    );
  }

  // Insertar attendance
  for (const a of DB.attendance) {
    await db.run(
      `INSERT INTO attendance (id, userId, scheduleId, dayOfWeek, date, clockIn, clockOut, status, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        a.id,
        a.userId,
        a.scheduleId,
        a.dayOfWeek,
        a.date,
        a.clockIn,
        a.clockOut,
        a.status,
        a.createdAt,
        a.createdBy,
        a.updatedAt,
        a.updatedBy,
        a.deletedAt,
        a.deletedBy,
        a.isDeleted,
      ]
    );
  }

  // Insertar auditLogs
  for (const log of DB.auditLogs) {
    await db.run(
      `INSERT INTO auditLog (id, tableName, recordId, action, changes, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.id,
        log.tableName,
        log.recordId,
        log.action,
        log.changes,
        log.createdAt,
        log.createdBy,
        log.updatedAt,
        log.updatedBy,
        log.deletedAt,
        log.deletedBy,
        log.isDeleted,
      ]
    );
  }

  console.log("✅ Base de datos recreada e inicializada con datos de ejemplo.");
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error("❌ Error al inicializar la base de datos:", err);
  });
}
