import { DataBase, UserWithPassword } from "../types/UserManagement";

/**
 * Base de datos simulada en memoria.
 * Útil para pruebas rápidas o desarrollo local sin SQLite.
 */
export const DB: DataBase = {
  users: [
    {
      uuid: '1',
      email: 'simil@example.com',
      username: 'simil.3021',
      password: 'simil21903180',
      nickname: 'Simil',
      role: 'admin',
      balance: { rafflePoints: 100 }
    },
    {
      uuid: '2',
      email: 'user@example.com',
      username: 'luis',
      password: 'luis',
      nickname: 'Luis',
      role: 'user',
      balance: { rafflePoints: 50 }
    },
    {
      uuid: '3',
      email: 'user3@example.com',
      username: 'dani',
      password: 'dani',
      nickname: 'Dani',
      role: 'admin',
      balance: { rafflePoints: 30 }
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
  ]
};
