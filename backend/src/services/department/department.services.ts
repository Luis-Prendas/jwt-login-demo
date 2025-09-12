import { Database } from "sqlite";
import { TBL_Department, TBL_User } from "../../types/DataBase";
import { v4 as uuidv4 } from "uuid";

// ============ GET ALL ============
export async function getAllDepartmentsService(
  db: Database,
  orgId: string
): Promise<TBL_Department[] | undefined> {
  return db.all<TBL_Department[]>(
    `SELECT * FROM department WHERE organizationId = ? AND isDeleted = 0`,
    [orgId]
  );
}

// ============ GET ONE ============
export async function getDepartmentService(
  db: Database,
  deptId: string
): Promise<TBL_Department | undefined> {
  return db.get<TBL_Department>(
    `SELECT * FROM department WHERE id = ? AND isDeleted = 0`,
    [deptId]
  );
}

// ============ UPDATE ============
export async function updateDepartmentService(
  db: Database,
  deptId: string,
  dataUpdate: Pick<TBL_Department, "name" | "description">,
  userRequest: TBL_User
): Promise<boolean> {
  const response = await db.run(
    `
    UPDATE department 
    SET name = ?, 
        description = ?, 
        updatedAt = ?, 
        updatedBy = ?
    WHERE id = ? AND isDeleted = 0
    `,
    [
      dataUpdate.name,
      dataUpdate.description ?? null,
      new Date().toISOString(),
      userRequest.id,
      deptId,
    ]
  );

  return response.changes! > 0;
}

// ============ CREATE ============
export async function createDepartmentService(
  db: Database,
  orgId: string,
  createData: Pick<TBL_Department, "name" | "description">,
  userRequest: TBL_User
) {
  const newUuid = uuidv4();
  const now = new Date().toISOString();

  await db.run(
    `
    INSERT INTO department 
    (id, organizationId, name, description, createdAt, createdBy, updatedAt, updatedBy, isDeleted) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `,
    [
      newUuid,
      orgId,
      createData.name,
      createData.description ?? null,
      now,
      userRequest.id,
      now,
      userRequest.id,
    ]
  );

  return newUuid; // opcional, útil para devolver el ID creado
}

// ============ DELETE (soft delete) ============
export async function deleteDepartmentService(
  db: Database,
  deptId: string,
  userRequest: TBL_User
) {
  const response = await db.run(
    `
    UPDATE department 
    SET isDeleted = 1,
        deletedAt = ?,
        deletedBy = ?
    WHERE id = ?
    `,
    [new Date().toISOString(), userRequest.id, deptId]
  );

  return response.changes! > 0;
}
