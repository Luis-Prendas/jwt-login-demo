import { Database } from "sqlite";
import { TBL_Organization, TBL_User } from "../../types/DataBase";
import { CreateData, UpdateOrg } from "../../controllers/organization/organization.controller";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

// ============ GET ALL ============
export async function getAllOrganizationService(
  db: Database
): Promise<TBL_Organization[] | undefined> {
  return db.all<TBL_Organization[]>(
    `SELECT * FROM organization WHERE isDeleted = 0`
  );
}

// ============ GET ONE ============
export async function getOrganizationService(
  db: Database,
  orgId: string
): Promise<TBL_Organization | undefined> {
  return db.get<TBL_Organization>(
    `SELECT * FROM organization WHERE id = ? AND isDeleted = 0`,
    [orgId]
  );
}

// ============ UPDATE ============
export async function updateOrganizationService(
  db: Database,
  dataUpdate: UpdateOrg,
  orgId: string,
  userRequest: TBL_User
): Promise<boolean> {
  const response = await db.run(
    `
    UPDATE organization 
    SET corporateName = ?, 
        displayName = ?, 
        slogan = ?, 
        updatedAt = ?, 
        updatedBy = ?
    WHERE id = ? AND isDeleted = 0
    `,
    [
      dataUpdate.corporateName,
      dataUpdate.displayName,
      dataUpdate.slogan ?? null,
      new Date().toISOString(),
      userRequest.id,
      orgId,
    ]
  );

  return response.changes! > 0;
}

// ============ CREATE ============
export async function createOrganizationService(
  db: Database,
  createData: CreateData,
  userRequest: TBL_User
) {
  const newUuid = uuidv4();
  const now = new Date().toISOString();
  const organizationCode = crypto.randomInt(1000, 10000).toString();

  await db.run(
    `
    INSERT INTO organization 
    (id, corporateName, displayName, organizationCode, logoUrl, slogan, description, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, isDeleted)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `,
    [
      newUuid,
      createData.corporateName,
      createData.displayName,
      organizationCode,
      null, // logoUrl opcional
      createData.slogan ?? null,
      createData.description ?? null,
      now,
      userRequest.id,
      now,
      userRequest.id,
      null,
      null,
    ]
  );

  return newUuid; // 👉 útil para devolver el ID creado
}

// ============ DELETE (soft delete) ============
export async function deleteOrganizationService(
  db: Database,
  orgId: string,
  userRequest: TBL_User
): Promise<boolean> {
  const response = await db.run(
    `
    UPDATE organization 
    SET isDeleted = 1,
        deletedAt = ?,
        deletedBy = ?
    WHERE id = ?
    `,
    [new Date().toISOString(), userRequest.id, orgId]
  );

  return response.changes! > 0;
}
