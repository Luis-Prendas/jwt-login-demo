import { Database } from "sqlite";
import { TBL_Organization } from "../../types/DataBase";

export async function gerAllOrg(db: Database): Promise<TBL_Organization[] | undefined> {
  return db.all<TBL_Organization[]>(`SELECT * FROM organization`)
}