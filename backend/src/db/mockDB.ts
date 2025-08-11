export interface User {
  uuid: string;
  mail: string;
  username: string;
  password: string;
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
      balance: { rafflePoints: 100 }
    }
  ]
};
