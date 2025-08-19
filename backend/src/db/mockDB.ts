import { DataBase, UserWithPassword } from "../types/UserManagement";

/**
 * Base de datos simulada en memoria.
 * Útil para pruebas rápidas o desarrollo local sin SQLite.
 */
export const DB: DataBase = {
  users: [
    {
      uuid: '1',
      email: 'user1@example.com',
      username: 'az',
      password: 'az',
      nickname: 'Simil',
      role: 'developer',
    },
    {
      uuid: '2',
      email: 'user2@example.com',
      username: 'daniel',
      password: 'daniel',
      nickname: 'Daniel',
      role: 'user',
    },
    {
      uuid: '3',
      email: 'user3@example.com',
      username: 'luis',
      password: 'luis',
      nickname: 'Luis',
      role: 'admin',
    }
  ] as UserWithPassword[], // Tipado explícito

  badges: [
    {
      uuid: 'b001',
      label: 'Primeros 10'
    },
    {
      uuid: 'b002',
      label: 'Developer'
    },
    {
      uuid: 'b003',
      label: 'Mew user'
    }
  ],

  userBadges: [
    {
      uuid: 'c001',
      userUuid: '1',
      badgeUuid: 'b003'
    },
    {
      uuid: 'c002',
      userUuid: '1',
      badgeUuid: 'b001'
    },
    {
      uuid: 'c003',
      userUuid: '1',
      badgeUuid: 'b002'
    },
    {
      uuid: 'c004',
      userUuid: '2',
      badgeUuid: 'b003'
    },
    {
      uuid: 'c005',
      userUuid: '2',
      badgeUuid: 'b001'
    },
    {
      uuid: 'c006',
      userUuid: '3',
      badgeUuid: 'b003'
    },
    {
      uuid: 'c007',
      userUuid: '3',
      badgeUuid: 'b001'
    }
  ],

  schedules: [
    {
      uuid: 's001',
      userUuid: '1',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00'
    },
    {
      uuid: 's002',
      userUuid: '2',
      dayOfWeek: 1,
      startTime: '10:00',
      endTime: '18:00'
    },
    {
      uuid: 's003',
      userUuid: '3',
      dayOfWeek: 2,
      startTime: '08:00',
      endTime: '16:00'
    }
  ],

  attendance: [
    {
      uuid: 'a001',
      userUuid: '1',
      date: '2023-03-01',
      clockIn: new Date('2023-03-01T07:42:12'),
      clockOut: new Date('2023-03-01T17:12:31')
    },
    {
      uuid: 'a002',
      userUuid: '2',
      date: '2023-03-01',
      clockIn: new Date('2023-03-01T07:42:12'),
      clockOut: new Date('2023-03-01T17:12:31')
    },
    {
      uuid: 'a003',
      userUuid: '3',
      date: '2023-03-01',
      clockIn: new Date('2023-03-01T07:42:12'),
      clockOut: new Date('2023-03-01T17:12:31')
    }
  ]
};
