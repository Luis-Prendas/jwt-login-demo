export interface UserBasicData {
  id: string;
  email: string;
  username: string;
  nickname: string;
  role: UserRole;
}

export interface LoginForm {
  username: string;
  password: string;
  orgCode: string;
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

export type UserRole =
  | 'user'
  | 'moderator'
  | 'admin'
  | 'superadmin'
  | 'developer';

export const USER_ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
  DEVELOPER: 'DEVELOPER'
}


interface BaseTableData {
  id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string | null;
  deletedBy: string | null;
  isDeleted: boolean;
}

interface DescriptiveData extends BaseTableData {
  description: string | null;
}

// =======================
// Auditoría
// =======================

export interface TBL_AuditLog extends BaseTableData {
  tableName: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  changes: string; // JSON string
}

// =======================
// Organización
// =======================

export interface TBL_Organization extends DescriptiveData {
  corporateName: string;
  displayName: string;
  organizationCode: string; // ej: "5568"
  logoUrl: string | null;
  slogan: string | null;
}

// =======================
// Departamento
// =======================

export interface TBL_Department extends DescriptiveData {
  organizationId: string; // FK -> Organization.id
  name: string;           // Ej: "Desarrollo", "Soporte"
}

// =======================
// Puestos dentro de un departamento
// =======================

export interface TBL_Position extends DescriptiveData {
  departmentId: string;   // FK -> Department.id
  maleName: string;       // Ej: "Contador", "Desarrollador"
  femaleName: string;     // Ej: "Contadora", "Desarrolladora"
}

// =======================
// Relación Usuario ↔ Puesto
// =======================

export interface TBL_UserPosition extends BaseTableData {
  userId: string;        // FK -> User.id
  positionId: string;    // FK -> Position.id
}

// =======================
// Usuario
// =======================

export interface UserWithPassword extends TBL_User {
  password: string;
}

export interface TBL_User extends DescriptiveData {
  email: string;
  username: string;
  nickname: string;
  name: string;
  lastName: string;
  phone: string | null;
  gender: "F" | "M" | "N"; // Femenino, Masculino, Neutro
  birthDate: string | null; // ISO Date string
  identificationNumber: string | null; // Número de identificación oficial
  address: string | null;
  role: UserRole;
  organizationId: string; // FK -> Organization.id
}

// =======================
// Horarios & Asistencia
// =======================

export interface TBL_Schedule extends DescriptiveData {
  userId: string;       // FK -> User.id
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface TBL_Attendance extends BaseTableData {
  userId: string;       // FK -> User.id
  scheduleId: string;   // FK -> Schedule.id
  dayOfWeek: number;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: 'early' | 'late' | 'on time' | 'absent' | null;
}
