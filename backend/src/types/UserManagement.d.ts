/**
 * Estructura de toda la "base de datos" simulada
 */
export interface DataBase {
  users: UserWithPassword[];
  badges: Badge[];
  userBadges: UserBadge[];
  schedules: Schedule[];
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
export interface UserBadge {
  uuid: string;
  badgeUuid: string;
  userUuid: string;
}

/**
 * Horario asignado al usuario
 */
export interface Schedule {
  uuid: string;
  userUuid: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

/**
 * Registro de entrada/salida
 */
export interface Attendance {
  uuid: string;
  userUuid: string;
  dayOfWeek: number;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
}
