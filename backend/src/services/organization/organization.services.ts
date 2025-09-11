import { Database } from "sqlite";
import { TBL_Organization } from "../../types/DataBase";
import { UpdateOrg } from "../../controllers/organization/organization.controller";

export async function getAllOrgService(db: Database): Promise<TBL_Organization[] | undefined> {
  return db.all<TBL_Organization[]>(`SELECT * FROM organization`)
}

export async function getOrgService(db: Database, orgId: string): Promise<TBL_Organization | undefined> {
  return db.get<TBL_Organization>(`SELECT * FROM organization WHERE organization.id = ?`, [orgId])
}

export async function updateOrganizationService(db: Database, dataUpdate: UpdateOrg, orgId: string): Promise<boolean> {
  const response = await db.run(`UPDATE organization SET corporateName = ?, displayName = ?, slogan = ? WHERE id = ?`, [dataUpdate.corporateName, dataUpdate.displayName, dataUpdate.slogan, orgId])
  return response.changes === 0
}