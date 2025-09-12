import { Router } from 'express';
import { validateBody } from '../middlewares/validate';
import { createOrganization, deleteOrganization, getAllOrg, getOrg, updateOrganization } from '../controllers/organization/organization.controller';
import { z } from 'zod';
import { authenticateToken } from '../middlewares/authenticateToken';

export const createOrgSchema = z.object({
  corporateName: z.string().min(1),
  displayName: z.string().min(1),
  slogan: z.string().optional(),
  description: z.string().optional(),
});
export const updateOrgSchema = z.object({
  corporateName: z.string().min(1),
  displayName: z.string().min(1),
  slogan: z.string().optional(),
  description: z.string().optional(),
});

const router = Router();

router.get('/getAllOrg', authenticateToken, getAllOrg);
router.get('/getOrg/:id', authenticateToken, getOrg);
router.put('/update/:id', authenticateToken, validateBody(updateOrgSchema), updateOrganization);
router.post('/create', authenticateToken, validateBody(createOrgSchema), createOrganization);
router.delete('/delete/:id', authenticateToken, deleteOrganization);

export default router;
