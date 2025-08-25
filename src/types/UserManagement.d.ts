export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  DEVELOPER = 'developer'
}

export interface UserBasicData {
  id: string;
  email: string;
  username: string;
  nickname: string;
  role: UserRole;
}

export interface LoginForm {
  username: string;
  password: string;
}

////////////////////////////////////////////////////////

export interface UserData {
  uuid: string;
  email: string;
  username: string;
  password: string;
  nickname: string;
  role: 'user' | 'admin' | 'developer' | 'moderator';
}

export interface UserDataWithBadges {
  userUuid: string;
  username: string;
  nickname: string;
  email: string;
  role: 'user' | 'admin' | 'developer' | 'moderator';
  rafflePoints: number;
  badges: Badge[] | null;
}



export interface RegisterData {
  email: string;
  username: string;
  password: string;
}



export type LoginResponse = {
  token: string | null
  error: string | null
}

export type Assistance = {
  uuid: string;
  userUuid: string;
  dayOfWeek: number;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
}

export type Schedule = {
  uuid: string;
  userUuid: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}
