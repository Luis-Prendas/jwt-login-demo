/**
 * Estructura de toda la "base de datos" simulada
 */
export interface DataBase {
  users: UserWithPassword[];        // Usuarios completos (incluye password)
  rooms: Room[];
  tabsMenuOptions: TabMenuOption[];
  badges: Badge[];
  userBadges: UserBadges[];
}

/**
 * Usuario con contraseña (almacenamiento interno)
 */
export interface UserWithPassword {
  uuid: string;
  email: string;
  username: string;
  password: string;
  nickname: string;
  role: 'user' | 'admin' | 'developer' | 'moderator';
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
 * Sala de chat
 */
export interface Room {
  uuid: string;
  name: string;
  capacity: number;
}

/**
 * Opción de menú/tab
 */
export interface TabMenuOption {
  uuid: string;
  label: string;
  icon: string;
  route: string;
  order: number;
  authRequired: boolean;
  rolesAllowed: ('user' | 'admin' | 'developer' | 'moderator')[];
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