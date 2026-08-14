import { Router } from 'express';
import { locationController } from '../controllers/locationController.js';
import { authenticate } from '../middleware/auth.js';
import { requireContentEditor } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugParams } from '../validators/shared.js';
import { createLocationSchema, updateLocationSchema } from '../validators/locationSchemas.js';

/* Routes: /api/locations */
const router = Router();

// Static "/main" registered BEFORE the :slug catch-all.
router.get('/', asyncHandler(locationController.list));
router.get('/main', asyncHandler(locationController.main));
router.get('/:slug', validate({ params: slugParams }), asyncHandler(locationController.getBySlug));

router.post(
  '/',
  authenticate,
  requireContentEditor,
  validate({ body: createLocationSchema }),
  asyncHandler(locationController.create),
);
router.put(
  '/:slug',
  authenticate,
  requireContentEditor,
  validate({ params: slugParams, body: updateLocationSchema }),
  asyncHandler(locationController.update),
);
router.delete(
  '/:slug',
  authenticate,
  requireContentEditor,
  validate({ params: slugParams }),
  asyncHandler(locationController.remove),
);

export default router;
