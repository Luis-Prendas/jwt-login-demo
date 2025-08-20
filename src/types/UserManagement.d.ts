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

export interface UserBasicData {
  uuid: string;
  email: string;
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
