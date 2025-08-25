import { Request, Response } from 'express';
import { initDB } from '../db/db';
import { Badge, UserBasicData } from '../types/UserManagement';

/**
 * Obtener información del usuario autenticado
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const username = req.user?.user.username;
    if (!username) return res.status(401).json({ error: 'Usuario no autenticado' });

    const db = await initDB();
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ user });
  } catch (err) {
    console.error('[GetUser Error]:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtener todos los usuarios
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const db = await initDB();
    const users = await db.all(`SELECT * FROM users`);
    res.json({ users });
  } catch (err) {
    console.error('[GetAllUsers Error]:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtener información de un usuario específico por UUID
 */
export const getUserWithBadges = async (req: Request, res: Response) => {
  type UserWithBadgeRow = {
    userUuid: string;
    username: string;
    nickname: string;
    email: string;
    role: 'user' | 'admin' | 'developer' | 'moderator';
    badges: Badge[] | null;
  };

  // fila de la consulta
  type RawUserBadgeRow = {
    userUuid: string;
    username: string;
    nickname: string;
    email: string;
    role: 'user' | 'admin' | 'developer' | 'moderator';
    rafflePoints: number;
    badgeUuid: string | null;
    badgeLabel: string | null;
  };

  try {
    const { uuid } = req.params; // asumimos que pasas el uuid por params

    if (!uuid) {
      return res.status(400).json({ error: "Se requiere el UUID del usuario." });
    }

    const db = await initDB();

    const rows: RawUserBadgeRow[] = await db.all<RawUserBadgeRow[]>(
      `
      SELECT 
        u.uuid AS userUuid,
        u.username,
        u.nickname,
        u.email,
        u.role,
        b.uuid AS badgeUuid,
        b.label AS badgeLabel
      FROM users u
      LEFT JOIN userBadges ub ON u.uuid = ub.userUuid
      LEFT JOIN badges b ON ub.badgeUuid = b.uuid
      WHERE u.uuid = ?
      `,
      [uuid]
    );

    const user: UserWithBadgeRow = {
      userUuid: rows[0].userUuid,
      username: rows[0].username,
      nickname: rows[0].nickname,
      email: rows[0].email,
      role: rows[0].role,
      badges: rows[0].badgeUuid
        ? rows.map(r => ({ uuid: r.badgeUuid!, label: r.badgeLabel! }))
        : null
    };

    res.status(200).json(user);
  } catch (err) {
    console.error("[GetUserWithBadges Error]:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

/**
 * Agregar puntos al usuario autenticado
 */
export const addPoints = async (req: Request, res: Response) => {
  try {
    const username = req.user?.user.username;
    if (!username) return res.status(401).json({ error: 'Usuario no autenticado' });

    const points = Number(req.body.points);
    if (isNaN(points) || points <= 0) return res.status(400).json({ error: 'Cantidad inválida' });

    const db = await initDB();
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const newBalance = user.rafflePoints + points;

    await db.run(`UPDATE users SET rafflePoints = ? WHERE username = ?`, [newBalance, username]);

    res.json({ message: 'Puntos agregados', user: { ...user, rafflePoints: newBalance } });
  } catch (err) {
    console.error('[AddPoints Error]:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Actualizar información de un usuario específico por UUID
 */
export const userUpdate = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const { nickname, username, role } = req.body;

    if (!uuid) {
      return res.status(400).json({ error: "Se requiere el UUID del usuario." });
    }

    const db = await initDB();

    await db.run(
      `UPDATE users SET nickname = ?, username = ?, role = ? WHERE uuid = ?`,
      [nickname, username, role, uuid]
    );

    res.status(200).json({ message: "Usuario actualizado con éxito." });
  } catch (err) {
    console.error("[UserUpdate Error]:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

/**
 * Obtener información de un usuario específico por UUID, incluyendo sus insignias, horarios y asistencia.
 */
export const getUserWithBadgesScheduleAttendance = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      return res.status(400).json({ error: "Se requiere el UUID del usuario." });
    }

    const db = await initDB();

    const user = await db.get(
      `
      SELECT 
        u.uuid AS userUuid,
        u.username,
        u.nickname,
        u.email,
        u.role
      FROM users u
      WHERE u.uuid = ?
      `,
      [uuid]
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const badges = await db.all(
      `
      SELECT b.uuid AS badgeUuid, b.label AS badgeLabel
      FROM badges b
      LEFT JOIN userBadges ub ON b.uuid = ub.badgeUuid
      WHERE ub.userUuid = ?
      `,
      [uuid]
    );

    const schedules = await db.all(
      `
      SELECT s.uuid AS scheduleUuid, s.dayOfWeek, s.startTime, s.endTime
      FROM schedules s
      WHERE s.userUuid = ?
      `,
      [uuid]
    );

    const attendance = await db.all(
      `
      SELECT a.uuid AS attendanceUuid, a.date, a.clockIn, a.clockOut
      FROM attendance a
      WHERE a.userUuid = ?
      `,
      [uuid]
    );

    res.status(200).json({
      user,
      badges,
      schedules,
      attendance
    });
  } catch (err) {
    console.error("[GetUserWithBadgesScheduleAttendance Error]:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}