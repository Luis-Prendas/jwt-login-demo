export interface User {
  uuid: string;
  mail: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
  balance: {
    rafflePoints: number;
  };
}

export const DB: { users: User[] } = {
  users: [
    {
      uuid: '1',
      mail: 'simil@example.com',
      username: 'simil',
      password: 'simil',
      role: 'admin',
      balance: { rafflePoints: 100 }
    }
  ]
};
