import { Router } from 'express';
import { ministryController } from '../controllers/ministryController.js';
import { authenticate } from '../middleware/auth.js';
import { requireContentEditor } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugParams } from '../validators/shared.js';
import {
  createMinistrySchema,
  ministryQuerySchema,
  updateMinistrySchema,
} from '../validators/ministrySchemas.js';

/* Routes: /api/ministries */
const router = Router();

router.get('/', validate({ query: ministryQuerySchema }), asyncHandler(ministryController.list));
router.get('/:slug', validate({ params: slugParams }), asyncHandler(ministryController.getBySlug));

router.post(
  '/',
  authenticate,
  requireContentEditor,
  validate({ body: createMinistrySchema }),
  asyncHandler(ministryController.create),
);
router.put(
  '/:slug',
  authenticate,
  requireContentEditor,
  validate({ params: slugParams, body: updateMinistrySchema }),
  asyncHandler(ministryController.update),
);
router.delete(
  '/:slug',
  authenticate,
  requireContentEditor,
  validate({ params: slugParams }),
  asyncHandler(ministryController.remove),
);

export default router;
