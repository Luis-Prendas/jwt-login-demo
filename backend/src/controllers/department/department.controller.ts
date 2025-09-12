import { Request, Response } from "express";
import { getLogger } from "../../utils/logger";
import { initDB } from "../../db/db";
import {
  createDepartmentService,
  deleteDepartmentService,
  getAllDepartmentsService,
  getDepartmentService,
  updateDepartmentService,
} from "../../services/department/department.services";
import { TBL_Department, TBL_User } from "../../types/DataBase";

const logger = getLogger("api-department");

export const getAllDepartments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const orgId = req.params.orgId;
    if (!orgId) {
      logger.warn("ID de la organización no proporcionado en la solicitud");
      return res
        .status(400)
        .json({ error: "ID de la organización no proporcionado" });
    }
    logger.info(`Obteniendo departamentos de la organización -> { ${orgId} }`);
    const db = await initDB();
    const departments = await getAllDepartmentsService(db, orgId);
    if (!departments || departments.length === 0) {
      logger.warn(`No se encontraron departamentos para la organización -> { ${orgId} }`);
      return res
        .status(404)
        .json({ error: "No se encontraron departamentos" });
    }
    logger.info(
      `Departamentos encontrados para la organización -> { ${orgId} }`
    );
    return res.json({ data: departments });
  } catch (err) {
    logger.error("[getAllDepartments Error]:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    logger.info(
      `------------ ${req.method} ${req.originalUrl} finalizado ------------`
    );
    logger.info("");
  }
};

export const getDepartment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      logger.warn("ID del departamento no proporcionado en la solicitud");
      return res
        .status(400)
        .json({ error: "ID del departamento no proporcionado" });
    }
    logger.info(`Obteniendo departamento -> { ${id} }`);
    const db = await initDB();
    const department = await getDepartmentService(db, id);
    if (!department) {
      logger.warn(`Departamento no encontrado -> { ${id} }`);
      return res.status(404).json({ error: "Departamento no encontrado" });
    }
    logger.info(`Departamento encontrado -> { ${id} }`);
    return res.json({ department });
  } catch (err) {
    logger.error("[getDepartment Error]:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    logger.info(
      `------------ ${req.method} ${req.originalUrl} finalizado ------------`
    );
    logger.info("");
  }
};

export const updateDepartment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id;
    const dataUpdate: Pick<TBL_Department, "name" | "description"> = req.body.content;
    const userRequest: TBL_User = req.body.userRequest;
    if (!id || !dataUpdate?.name) {
      logger.warn(
        `ID de departamento o datos no proporcionados -> { ${id} | ${dataUpdate?.name ?? "null"} }`
      );
      return res
        .status(400)
        .json({ error: "ID de departamento o datos no proporcionados" });
    }
    logger.info(
      `Actualizando departamento -> { ${id} | ${dataUpdate.name} }`
    );
    const db = await initDB();
    const result = await updateDepartmentService(db, id, dataUpdate, userRequest);
    if (!result) {
      logger.warn(`No se pudo actualizar el departamento -> { ${id} }`);
      return res
        .status(404)
        .json({ error: "No se pudo actualizar el departamento" });
    }
    logger.info(`Departamento actualizado con éxito -> { ${id} }`);
    return res.json({ success: true });
  } catch (err) {
    logger.error("[updateDepartment Error]:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    logger.info(
      `------------ ${req.method} ${req.originalUrl} finalizado ------------`
    );
    logger.info("");
  }
};

export const createDepartment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const orgId = req.params.orgId;
    const userRequest: TBL_User = req.body.userRequest;
    const createData: Pick<TBL_Department, "name" | "description"> = req.body.content;
    if (!orgId || !createData?.name) {
      logger.warn(
        `Datos del departamento no proporcionados -> { ${orgId} | ${createData?.name ?? "null"} }`
      );
      return res
        .status(400)
        .json({ error: "Datos del departamento no proporcionados" });
    }
    logger.info(
      `Creando departamento -> { ${createData.name} | orgId: ${orgId} }`
    );
    const db = await initDB();
    const result = await createDepartmentService(db, orgId, createData, userRequest);
    if (!result) {
      logger.warn(
        `No se pudo crear el departamento -> { ${createData.name} | orgId: ${orgId} }`
      );
      return res
        .status(404)
        .json({ error: "No se pudo crear el departamento" });
    }
    logger.info(
      `Departamento creado con éxito -> { ${createData.name} | orgId: ${orgId} }`
    );
    return res.json({ departmentId: result });
  } catch (err) {
    logger.error("[createDepartment Error]:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    logger.info(
      `------------ ${req.method} ${req.originalUrl} finalizado ------------`
    );
    logger.info("");
  }
};

export const deleteDepartment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userRequest: TBL_User = req.body.userRequest;
    const id = req.params.id;
    if (!id) {
      logger.warn("ID del departamento no proporcionado en la solicitud");
      return res
        .status(400)
        .json({ error: "ID del departamento no proporcionado" });
    }
    logger.info(`Eliminando departamento -> { ${id} }`);
    const db = await initDB();
    const result = await deleteDepartmentService(db, id, userRequest);
    if (!result) {
      logger.warn(`Departamento no encontrado -> { ${id} }`);
      return res.status(404).json({ error: "Departamento no encontrado" });
    }
    logger.info(`Departamento eliminado -> { ${id} }`);
    return res.json({ success: true });
  } catch (err) {
    logger.error("[deleteDepartment Error]:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    logger.info(
      `------------ ${req.method} ${req.originalUrl} finalizado ------------`
    );
    logger.info("");
  }
};
