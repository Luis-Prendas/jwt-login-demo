export interface DB {
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

export const DB: DB = {
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
      role: 'user',
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
  ]
};
