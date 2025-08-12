export interface DataBase {
  users: User[];
  rooms: Room[];
}

export interface User {
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

export interface Room {
  uuid: string;
  name: string;
  capacity: number;
}