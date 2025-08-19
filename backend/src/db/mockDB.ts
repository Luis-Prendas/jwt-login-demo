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

  rooms: [
    { uuid: 'room1', name: 'Room 1', capacity: 2 },
    { uuid: 'room2', name: 'Room 2', capacity: 2 },
    { uuid: 'room3', name: 'Room 3', capacity: 2 }
  ],

  tabsMenuOptions: [
    {
      uuid: 'a001',
      label: 'Inicio',
      icon: 'home',
      route: '/',
      order: 1,
      authRequired: false,
      rolesAllowed: ['user', 'admin', 'developer', 'moderator']
    },
    {
      uuid: 'a002',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      order: 2,
      authRequired: true,
      rolesAllowed: ['user', 'admin', 'developer', 'moderator']
    },
    {
      uuid: 'a003',
      label: 'Salas',
      icon: 'rooms',
      route: '/create-room',
      order: 3,
      authRequired: true,
      rolesAllowed: ['user', 'admin', 'developer', 'moderator']
    },
    {
      uuid: 'a004',
      label: 'Herramientas',
      icon: 'tools',
      route: '/dev-tools',
      order: 4,
      authRequired: true,
      rolesAllowed: ['admin', 'developer']
    },
    {
      uuid: 'a005',
      label: 'Gestión de usuarios',
      icon: 'user-management',
      route: '/user-management',
      order: 5,
      authRequired: true,
      rolesAllowed: ['admin', 'developer']
    },
    {
      uuid: 'a006',
      label: 'Tabs config',
      icon: 'tabs-config',
      route: '/tabs-config',
      order: 6,
      authRequired: true,
      rolesAllowed: ['admin', 'developer']
    }
  ],

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
  ]
};
