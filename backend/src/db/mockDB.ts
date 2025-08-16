import { DataBase } from "../types/UserManagement";

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
  ],
  rooms: [
    {
      uuid: 'room1',
      name: 'Room 1',
      capacity: 2
    },
    {
      uuid: 'room2',
      name: 'Room 2',
      capacity: 2
    },
    {
      uuid: 'room3',
      name: 'Room 3',
      capacity: 2
    }
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
      authRequired: true,
      order: 2,
      rolesAllowed: ['user', 'admin', 'developer', 'moderator']
    },
    {
      uuid: 'a003',
      label: 'Salas',
      icon: 'rooms',
      route: '/create-room',
      authRequired: true,
      order: 3,
      rolesAllowed: ['user', 'admin', 'developer', 'moderator']
    },
    {
      uuid: 'a004',
      label: 'Herramientas',
      icon: 'tools',
      route: '/dev-tools',
      authRequired: true,
      order: 4,
      rolesAllowed: ['admin', 'developer']
    },
    {
      uuid: 'a005',
      label: 'Gestion de usuarios',
      icon: 'user-management',
      route: '/user-management',
      authRequired: true,
      order: 5,
      rolesAllowed: ['admin', 'developer']
    },
    {
      uuid: 'a006',
      label: 'Tabs config',
      icon: 'tabs-config',
      route: '/tabs-config',
      authRequired: true,
      order: 6,
      rolesAllowed: ['admin', 'developer']
    }
  ]
};
