import { DataBase, UserRole } from "../types/DB";

export const DB: DataBase = {
  users: [
    {
      id: 'a001',
      email: 'luisprendas.dev@gmail.com',
      username: 'az',
      password: 'az',
      nickname: 'Simil',
      role: UserRole.DEVELOPER,
      description: 'Usuario desarrollador principal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false
    },
    {
      id: 'a002',
      email: 'user1@example.com',
      username: 'user1',
      password: 'user1',
      nickname: 'User 1',
      role: UserRole.USER,
      description: 'Usuario estándar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false
    },
    {
      id: 'a003',
      email: 'user2@example.com',
      username: 'user2',
      password: 'user2',
      nickname: 'User 2',
      role: UserRole.MODERATOR,
      description: 'Moderador de contenido',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false
    },
    {
      id: 'a004',
      email: 'user3@example.com',
      username: 'user3',
      password: 'user3',
      nickname: 'User 3',
      role: UserRole.ADMIN,
      description: 'Administrador del sistema',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false
    }
  ],

  badges: [
    {
      id: 'b001',
      label: 'Primeros 10',
      description: 'Completó los primeros 10 pasos',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false
    },
    {
      id: 'b002',
      label: 'Developer',
      description: 'Reconocimiento a desarrollador',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false
    },
    {
      id: 'b003',
      label: 'New user',
      description: 'Usuario recién registrado',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false
    }
  ],

  userBadges: [
    { id: 'c001', userId: 'a001', badgeId: 'b003', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'c002', userId: 'a001', badgeId: 'b001', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'c003', userId: 'a001', badgeId: 'b002', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'c004', userId: 'a002', badgeId: 'b003', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'c005', userId: 'a002', badgeId: 'b001', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'c006', userId: 'a003', badgeId: 'b003', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'c007', userId: 'a003', badgeId: 'b001', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'c008', userId: 'a004', badgeId: 'b001', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'c009', userId: 'a004', badgeId: 'b002', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false }
  ],

  schedules: [
    { id: 'd001', userId: 'a001', dayOfWeek: 1, startTime: '09:00', endTime: '16:55', description: 'Lunes laboral', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'd002', userId: 'a001', dayOfWeek: 2, startTime: '09:00', endTime: '16:55', description: 'Martes laboral', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'd003', userId: 'a001', dayOfWeek: 3, startTime: '09:00', endTime: '16:55', description: 'Miércoles laboral', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'd004', userId: 'a001', dayOfWeek: 4, startTime: '09:00', endTime: '16:55', description: 'Jueves laboral', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'd005', userId: 'a001', dayOfWeek: 5, startTime: '09:00', endTime: '16:55', description: 'Viernes laboral', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false }
  ],

  attendance: [
    { id: 'e001', userId: 'a001', scheduleId: 'd002', dayOfWeek: 2, date: new Date('2023-03-01T07:42:11').toISOString(), clockIn: new Date('2023-03-01T09:01:12').toISOString(), clockOut: new Date('2023-03-01T16:58:31').toISOString(), status: 'late', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'e002', userId: 'a001', scheduleId: 'd003', dayOfWeek: 3, date: new Date('2023-03-02T07:42:11').toISOString(), clockIn: new Date('2023-03-02T08:55:55').toISOString(), clockOut: new Date('2023-03-02T16:52:31').toISOString(), status: 'on time', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'e003', userId: 'a001', scheduleId: 'd004', dayOfWeek: 4, date: new Date('2023-03-03T07:42:11').toISOString(), clockIn: new Date('2023-03-03T09:06:12').toISOString(), clockOut: new Date('2023-03-03T17:01:31').toISOString(), status: 'late', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false },
    { id: 'e004', userId: 'a001', scheduleId: 'd005', dayOfWeek: 5, date: new Date('2023-03-04T07:42:11').toISOString(), clockIn: new Date('2023-03-04T08:53:12').toISOString(), clockOut: new Date('2023-03-04T17:12:31').toISOString(), status: 'on time', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false }
  ]
};
