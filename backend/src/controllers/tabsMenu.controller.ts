import { Request, Response } from 'express';
import { initDB } from '../db/db';
import { UserBasicData } from '../types/UserManagement';

/**
 * Retorna todas las opciones de menú filtradas según el rol del usuario autenticado
 */
export const getAllUserTabsMenu = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.user.role;
    if (!userRole) return res.status(403).json({ error: 'Forbidden' });

    const db = await initDB();
    const tabs = await db.all(`SELECT * FROM tabsMenuOptions`);

    // Filtrar según rol y authRequired
    const filteredTabs = tabs.filter((tab: any) => {
      const rolesAllowed = JSON.parse(tab.rolesAllowed) as string[];
      return tab.authRequired ? rolesAllowed.includes(userRole) : true;
    });

    res.json(filteredTabs);
  } catch (err) {
    console.error('[GetAllUserTabsMenu Error]:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Retorna todas las opciones de menú sin filtrar
 */
export const getAllTabsMenu = async (_req: Request, res: Response) => {
  try {
    const db = await initDB();
    const tabs = await db.all(`SELECT * FROM tabsMenuOptions`);
    res.json(tabs);
  } catch (err) {
    console.error('[GetAllTabsMenu Error]:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
