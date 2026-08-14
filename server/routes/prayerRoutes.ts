import { Router } from 'express';
import { z } from 'zod';
import { prayerController } from '../controllers/prayerController.js';
import { authenticate } from '../middleware/auth.js';
import { requireStaff } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { submissionLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParams } from '../validators/shared.js';
import { prayerListQuerySchema, prayerSubmitSchema } from '../validators/prayerSchemas.js';

/* Routes: /api/prayer */
const router = Router();

// Public submission — strict rate limit + zod validation + honeypot.
router.post(
  '/',
  submissionLimiter,
  validate({ body: prayerSubmitSchema }),
  asyncHandler(prayerController.submit),
);

// Staff+ review.
router.get(
  '/',
  authenticate,
  requireStaff,
  validate({ query: prayerListQuerySchema }),
  asyncHandler(prayerController.list),
);
router.patch(
  '/:id/handled',
  authenticate,
  requireStaff,
  validate({ params: idParams, body: z.object({ handled: z.boolean().optional() }) }),
  asyncHandler(prayerController.setHandled),
);

export default router;
