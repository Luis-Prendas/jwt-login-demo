import { Router } from 'express';
import { validateBody } from '../middlewares/validate';
import { createOrganization, deleteOrganization, getAllOrg, getOrg, updateOrganization } from '../controllers/organization/organization.controller';
import { z } from 'zod';
import { authenticateToken } from '../middlewares/authenticateToken';
import { createOrganizationSchema, updateOrganizationSchema } from '../zod-schemas';

export type UpdateOrganizationDto = z.infer<typeof updateOrganizationSchema>;
export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>

const router = Router();

router.get('/getAll', authenticateToken, getAllOrg);
router.get('/get/:id', authenticateToken, getOrg);
router.put('/update/:id', authenticateToken, validateBody(updateOrganizationSchema), updateOrganization);
router.post('/create', authenticateToken, validateBody(createOrganizationSchema), createOrganization);
router.delete('/delete/:id', authenticateToken, deleteOrganization);

export default router;
