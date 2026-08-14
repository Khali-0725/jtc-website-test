import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParams } from '../validators/shared.js';
import {
  createUserSchema,
  updateUserSchema,
  userListQuerySchema,
} from '../validators/userSchemas.js';

/* Routes: /api/users — ADMIN and SUPER_ADMIN only. */
const router = Router();

// Every route in this module requires an authenticated admin.
router.use(authenticate, requireAdmin);

router.get('/', validate({ query: userListQuerySchema }), asyncHandler(userController.list));
router.get('/:id', validate({ params: idParams }), asyncHandler(userController.get));
router.post('/', validate({ body: createUserSchema }), asyncHandler(userController.create));
router.put(
  '/:id',
  validate({ params: idParams, body: updateUserSchema }),
  asyncHandler(userController.update),
);
router.delete('/:id', validate({ params: idParams }), asyncHandler(userController.remove));

export default router;
