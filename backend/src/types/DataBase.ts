export interface DataBase {
  users: UserWithPassword[];
  badges: TBL_Badge[];
  userBadges: TBL_UserBadge[];
  schedules: TBL_Schedule[];
  attendance: TBL_Attendance[];
}

export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  DEVELOPER = 'developer'
}

// Tabla básica
interface BaseTableData {
  id: string; // uuid
  createdAt: string; // ISO string mejor para compatibilidad DB
  updatedAt: string;
  isDeleted: boolean;
}

// Tabla con descripción
interface DescriptiveData extends BaseTableData {
  description: string | null;
}

export interface UserWithPassword extends TBL_User {
  password: string;
}

export interface TBL_User extends DescriptiveData {
  email: string;
  username: string;
  nickname: string;
  role: UserRole;
}

interface TBL_Badge extends DescriptiveData {
  label: string;
}

interface TBL_UserBadge extends BaseTableData {
  userId: string;
  badgeId: string;
}

interface TBL_Schedule extends DescriptiveData {
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface TBL_Attendance extends BaseTableData {
  userId: string;
  scheduleId: string;
  dayOfWeek: number;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: 'early' | 'late' | 'on time' | 'absent' | null;
}
