import { DataBase } from "../types/UserManagement";

export const DB: DataBase = {
  users: [
    {
      uuid: '1',
      mail: 'simil@example.com',
      username: 'simil',
      password: 'simil',
      nickname: 'Simil',
      role: 'admin',
      balance: { rafflePoints: 100 }
    },
    {
      uuid: '2',
      mail: 'user@example.com',
      username: 'luis',
      password: 'luis',
      nickname: 'Luis',
      role: 'user',
      balance: { rafflePoints: 50 }
    },
    {
      uuid: '3',
      mail: 'user3@example.com',
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
      authRequired: false,
      rolesAllowed: ['user', 'admin', 'developer', 'moderator']
    },
    {
      uuid: 'a002',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      authRequired: true,
      rolesAllowed: ['user', 'admin', 'developer', 'moderator']
    },
    {
      uuid: 'a003',
      label: 'Salas',
      icon: 'rooms',
      route: '/create-room',
      authRequired: true,
      rolesAllowed: ['user', 'admin', 'developer', 'moderator']
    },
    {
      uuid: 'a004',
      label: 'Herramientas',
      icon: 'tools',
      route: '/dev-tools',
      authRequired: true,
      rolesAllowed: ['admin', 'developer']
    },
    {
      uuid: 'a005',
      label: 'Gestion de usuarios',
      icon: 'user-management',
      route: '/user-management',
      authRequired: true,
      rolesAllowed: ['admin', 'developer']
    },
  ]
};
