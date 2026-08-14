import { Router } from 'express';
import { settingsController } from '../controllers/settingsController.js';
import { authenticate } from '../middleware/auth.js';
import { requireMinRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { updateSettingsSchema } from '../validators/settingsSchemas.js';

/* Routes: /api/settings
   - GET  /  public read (branding for the whole site).
   - PUT  /  SUPER_ADMIN only — change logo / backgrounds / OG image /
             accent color. Guarded by authenticate -> requireMinRole. */
const router = Router();

router.get('/', asyncHandler(settingsController.get));

router.put(
  '/',
  authenticate,
  requireMinRole('SUPER_ADMIN'),
  validate({ body: updateSettingsSchema }),
  asyncHandler(settingsController.update),
);

export default router;
