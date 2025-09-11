import { Database } from "sqlite";
import { TBL_Organization, TBL_User } from "../../types/DataBase";
import { CreateData, UpdateOrg } from "../../controllers/organization/organization.controller";
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';

export async function getAllOrganizationService(db: Database): Promise<TBL_Organization[] | undefined> {
  return db.all<TBL_Organization[]>(`SELECT * FROM organization WHERE isDeleted = 0`)
}

export async function getOrganizationService(db: Database, orgId: string): Promise<TBL_Organization | undefined> {
  return db.get<TBL_Organization>(`SELECT * FROM organization WHERE organization.id = ? AND isDeleted = 0`, [orgId])
}

export async function updateOrganizationService(db: Database, dataUpdate: UpdateOrg, orgId: string, userRequest: TBL_User): Promise<boolean> {
  const response = await db.run(`
    UPDATE organization 
    SET corporateName = ?, 
    displayName = ?, 
    slogan = ?, 
    updatedAt = ?, 
    updatedBy = ?
    WHERE id = ?`,
    [
      dataUpdate.corporateName,
      dataUpdate.displayName,
      dataUpdate.slogan,
      new Date().toISOString(),
      userRequest.id,
      orgId
    ]
  )

  return response.changes! > 0
}

export async function createOrganizationService(db: Database, createData: CreateData, userRequest: TBL_User) {
  const newUuid = uuidv4();
  const now = new Date().toISOString();
  const organizationCode = crypto.randomInt(1000, 10000).toString()
  const response = await db.run(
    `INSERT INTO organization (id, corporateName, displayName, organizationCode, logoUrl, slogan, description, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newUuid,
      createData.corporateName,
      createData.displayName,
      organizationCode,
      null,
      createData.slogan,
      null,
      now,
      userRequest.id,
      now,
      userRequest.id,
      null,
      null,
    ]
  );
}

export async function deleteOrganizationService(db: Database, orgId: string, userRequest: TBL_User) {
  const response = await db.run(`
    UPDATE organization 
    SET isDeleted = ?,
    deletedAt = ?,
    deletedBy = ?
    WHERE id = ?`,
    [
      1,
      new Date().toISOString(),
      userRequest.id,
      orgId
    ]
  )

  return response.changes! > 0
}