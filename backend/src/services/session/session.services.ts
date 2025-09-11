import { Database } from 'sqlite';
import { UserWithPassword } from '../../types/DataBase';

export async function getUserByUsernameAndOrg(
  db: Database,
  username: string,
  orgCode: string
): Promise<UserWithPassword | undefined> {
  return db.get<UserWithPassword>(
    `
    SELECT us.* 
    FROM user AS us
    INNER JOIN organization AS org 
      ON us.organizationId = org.id
    WHERE us.username = ?
      AND org.organizationCode = ?
      AND us.isDeleted = 0
    `,
    [username, orgCode]
  );
}
