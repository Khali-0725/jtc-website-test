import { Router } from 'express';
import { staffController } from '../controllers/staffController.js';
import { authenticate } from '../middleware/auth.js';
import { requireContentEditor } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParams } from '../validators/shared.js';
import { createStaffSchema, updateStaffSchema } from '../validators/staffSchemas.js';

/* Routes: /api/staff */
const router = Router();

router.get('/', asyncHandler(staffController.list));

router.post(
  '/',
  authenticate,
  requireContentEditor,
  validate({ body: createStaffSchema }),
  asyncHandler(staffController.create),
);
router.put(
  '/:id',
  authenticate,
  requireContentEditor,
  validate({ params: idParams, body: updateStaffSchema }),
  asyncHandler(staffController.update),
);
router.delete(
  '/:id',
  authenticate,
  requireContentEditor,
  validate({ params: idParams }),
  asyncHandler(staffController.remove),
);

export default router;
