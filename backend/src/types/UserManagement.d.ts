export interface DataBase {
  users: User[];
  rooms: Room[];
  tabsMenuOptions: TabMenuOption[];
}

export interface User {
  uuid: string;
  email: string;
  username: string;
  password: string;
  nickname: string;
  role: 'user' | 'admin' | 'developer' | 'moderator';
  balance: {
    rafflePoints: number;
  };
}

export interface UserBasicData {
  uuid: string;
  email: string;
  username: string;
  nickname: string;
  role: 'user' | 'admin' | 'developer' | 'moderator';
}

export interface Room {
  uuid: string;
  name: string;
  capacity: number;
}

export interface TabMenuOption {
  uuid: string;
  label: string;
  icon: string;
  route: string;
  order: number;
  authRequired: boolean;
  rolesAllowed: ('user' | 'admin' | 'developer' | 'moderator')[];
}