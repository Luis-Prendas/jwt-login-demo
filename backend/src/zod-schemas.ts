// zod-schemas.ts
import { z } from 'zod';

// ======================
// ENUMS
// ======================
export const GenderSchema = z.enum(["M", "F", "N"]);
export const UserRoleSchema = z.enum(["ADMIN", "DEVELOPER", "MANAGER", "EMPLOYEE"]);

// ====================== 
// ORGANIZATION 
// ======================
export const createOrganizationSchema = z.object({
  corporateName: z.string().min(1),
  displayName: z.string().min(1),
  logoUrl: z.string().url().optional(),
  slogan: z.string().optional(),
  description: z.string().optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.extend({ organizationCode: z.string().min(1) }).partial();

// ======================
// DEPARTMENT
// ======================
export const createDepartmentSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.omit({ organizationId: true }).partial();

// ======================
// POSITION
// ======================
export const createPositionSchema = z.object({
  departmentId: z.string().uuid(),
  maleName: z.string().min(1),
  femaleName: z.string().min(1),
  description: z.string().optional(),
});

export const updatePositionSchema = createPositionSchema.omit({ departmentId: true }).partial();

// ======================
// USER
// ======================
export const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(6),
  nickname: z.string().min(1),
  name: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  gender: GenderSchema,
  birthDate: z.coerce.date().optional(),
  indentificationNumber: z.string().optional(),
  address: z.string().optional(),
  role: UserRoleSchema,
  organizationId: z.string().uuid(),
  description: z.string().optional(),
});

export const updateUserSchema = createUserSchema.omit({ organizationId: true, password: true }).partial();

// ======================
// USER POSITION
// ======================
export const createUserPositionSchema = z.object({
  userId: z.string().uuid(),
  positionId: z.string().uuid(),
});

export const updateUserPositionSchema = createUserPositionSchema.partial();

// ======================
// SCHEDULE
// ======================
export const createScheduleSchema = z.object({
  userId: z.string().uuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  description: z.string().optional(),
});

export const updateScheduleSchema = createScheduleSchema.partial();

// ======================
// ATTENDANCE
// ======================
export const createAttendanceSchema = z.object({
  userId: z.string().uuid(),
  scheduleId: z.string().uuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  date: z.coerce.date(),
  clockIn: z.coerce.date(),
  clockOut: z.coerce.date().optional(),
  status: z.string().optional(),
});

export const updateAttendanceSchema = createAttendanceSchema.partial();
