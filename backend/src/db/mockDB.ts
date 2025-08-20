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
      endTime: '16:55'
    },
    {
      uuid: 's002',
      userUuid: '1',
      dayOfWeek: 2,
      startTime: '09:00',
      endTime: '16:55'
    },
    {
      uuid: 's003',
      userUuid: '1',
      dayOfWeek: 3,
      startTime: '09:00',
      endTime: '16:55'
    },
    {
      uuid: 's004',
      userUuid: '1',
      dayOfWeek: 4,
      startTime: '09:00',
      endTime: '16:55'
    },
    {
      uuid: 's005',
      userUuid: '1',
      dayOfWeek: 5,
      startTime: '09:00',
      endTime: '16:55'
    }
  ],

  attendance: [
    {
      uuid: 'a001',
      userUuid: '1',
      dayOfWeek: 2,
      date: new Date('2023-03-01T07:42:11'),
      clockIn: new Date('2023-03-01T09:01:12'),
      clockOut: new Date('2023-03-01T16:58:31')
    },
    {
      uuid: 'a002',
      userUuid: '1',
      dayOfWeek: 3,
      date: new Date('2023-03-02T07:42:11'),
      clockIn: new Date('2023-03-02T08:55:55'),
      clockOut: new Date('2023-03-02T16:52:31')
    },
    {
      uuid: 'a003',
      userUuid: '1',
      dayOfWeek: 4,
      date: new Date('2023-03-03T07:42:11'),
      clockIn: new Date('2023-03-03T09:06:12'),
      clockOut: new Date('2023-03-03T17:01:31')
    },
    {
      uuid: 'a004',
      userUuid: '1',
      dayOfWeek: 5,
      date: new Date('2023-03-04T07:42:11'),
      clockIn: new Date('2023-03-04T08:53:12'),
      clockOut: new Date('2023-03-04T17:12:31')
    }
  ]
};
