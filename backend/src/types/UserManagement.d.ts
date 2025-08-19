/**
 * Estructura de toda la "base de datos" simulada
 */
export interface DataBase {
  users: UserWithPassword[];
  badges: Badge[];
  userBadges: UserBadges[];
  schedules: UserSchedule[];
  attendance: Attendance[];
}

/**
 * Usuario con contraseña (almacenamiento interno)
 */
export interface UserWithPassword extends UserBasicData {
  password: string;
}

/**
 * Datos básicos de usuario (sin password)
 * Para exponer al frontend o generar JWT
 */
export interface UserBasicData {
  uuid: string;
  email: string;
  username: string;
  nickname: string;
  role: 'user' | 'admin' | 'developer' | 'moderator';
}

/**
 * Insignias
 */
export interface Badge {
  uuid: string;
  label: string;
}

/**
 * Relacion user -> badges
 */
export interface UserBadges {
  uuid: string;
  badgeUuid: string;
  userUuid: string;
}

/**
 * Horario asignado al usuario
 */
export interface UserSchedule {
  uuid: string;          // ID del horario
  userUuid: string;      // Usuario asignado
  dayOfWeek: number;     // 0=domingo ... 6=sábado
  startTime: string;     // "08:00"
  endTime: string;       // "17:00"
}

/**
 * Registro de entrada/salida
 */
export interface Attendance {
  uuid: string;
  userUuid: string;
  date: string;          // Fecha del registro (YYYY-MM-DD)
  clockIn: Date;         // Fecha/hora de entrada
  clockOut?: Date;       // Fecha/hora de salida (puede ser null si no ha salido aún)
}
