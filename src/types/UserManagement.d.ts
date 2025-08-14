export interface UserData {
  uuid: string;
  mail: string;
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
  mail: string;
  username: string;
  nickname: string;
  role: 'user' | 'admin' | 'developer' | 'moderator';
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
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

export type LoginResponse = {
  token: string | null
  error: string | null
}