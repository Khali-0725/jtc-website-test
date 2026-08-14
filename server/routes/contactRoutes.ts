import { Router } from 'express';
import { z } from 'zod';
import { contactController } from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';
import { requireStaff } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { submissionLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParams } from '../validators/shared.js';
import { contactListQuerySchema, contactSubmitSchema } from '../validators/contactSchemas.js';

/* Routes: /api/contact */
const router = Router();

router.post(
  '/',
  submissionLimiter,
  validate({ body: contactSubmitSchema }),
  asyncHandler(contactController.submit),
);

router.get(
  '/',
  authenticate,
  requireStaff,
  validate({ query: contactListQuerySchema }),
  asyncHandler(contactController.list),
);
router.patch(
  '/:id/handled',
  authenticate,
  requireStaff,
  validate({ params: idParams, body: z.object({ handled: z.boolean().optional() }) }),
  asyncHandler(contactController.setHandled),
);

export default router;
