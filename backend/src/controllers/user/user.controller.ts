import { Request, Response } from 'express';
import { initDB } from '../../db/db';
import { getLogger } from '../../utils/logger';
import { UserWithPassword } from '../../types/DataBase';

const logger = getLogger('api-user');

export const getUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      logger.warn('ID de usuario no proporcionado en la solicitud');
      return res.status(400).json({ error: 'ID de usuario no proporcionado' });
    }
    logger.info(`Obteniendo usuario con ID: ${id}`);
    const db = await initDB();
    const user = await db.get(`SELECT * FROM user WHERE id = ?`, [id]) as UserWithPassword;
    if (!user) {
      logger.warn(`Usuario no encontrado con ID: ${id}`);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const { password, ...userWithoutPassword } = user;
    logger.info(`Usuario encontrado: ${JSON.stringify(userWithoutPassword)}`);
    return res.json({ user: userWithoutPassword });
  } catch (err) {
    logger.error('[GetUser Error]:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    logger.info('Obteniendo todos los usuarios');
    const db = await initDB();
    const users = await db.all(`SELECT * FROM user`) as UserWithPassword[];
    if (!users || users.length === 0) {
      logger.warn('No se encontraron usuarios');
      return res.status(404).json({ error: 'No se encontraron usuarios' });
    }
    logger.info(`Usuarios encontrados: ${JSON.stringify(users)}`);
    const response = users.map(({ id, username, nickname, email, role }) => ({ id, username, nickname, email, role }));
    return res.json({ users: response });
  } catch (err) {
    logger.error('[GetAllUsers Error]:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const { username, email, nickname, role } = req.body.content
    if (!id || !username || !email || !nickname || !role) {
      logger.warn('ID de usuario o datos de usuario no proporcionados');
      return res.status(400).json({ error: 'ID de usuario o datos de usuario no proporcionados' });
    }
    logger.info(`Actualizando usuario con ID: ${id}`);
    const db = await initDB();
    const result = await db.run(`UPDATE user SET username = ?, email = ?, nickname = ?, role = ? WHERE id = ?`, [username, email, nickname, role, id]);
    if (result.changes === 0) {
      logger.warn(`No se pudo actualizar el usuario con ID: ${id}`);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    logger.info(`Usuario actualizado con éxito: ${JSON.stringify({ username, email, nickname, role })}`);
    return res.json({ success: true });
  } catch (error) {
    logger.error('[UpdateUser Error]:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
  }
};

export const userDelete = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      logger.warn('ID de usuario no proporcionado en la solicitud');
      return res.status(400).json({ error: 'ID de usuario no proporcionado' });
    }
    logger.info(`Eliminando usuario con ID: ${id}`);
    const db = await initDB();
    const result = await db.run(`DELETE FROM user WHERE id = ?`, [id]);
    if (result.changes === 0) {
      logger.warn(`No se pudo eliminar el usuario con ID: ${id}`);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    logger.info(`Usuario eliminado con éxito: ${id}`);
    return res.json({ success: true });
  } catch (error) {
    logger.error('[UserDelete Error]:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    logger.info(`------------ ${req.method} ${req.originalUrl} finalizado ------------`);
  }
};
