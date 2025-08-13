import { Request, Response } from 'express';
import { DB } from '../db/mockDB';

export const getAllTabsMenu = (req: Request, res: Response) => {
  const userRole = req.user?.user.role

  if (!userRole) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const tabs = DB.tabsMenuOptions.filter(tab => {
    return tab.authRequired ? tab.rolesAllowed.includes(userRole) : true;
  });

  res.json(tabs);
};
