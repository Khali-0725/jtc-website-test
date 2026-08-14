import { Router } from 'express';
import { sermonController } from '../controllers/sermonController.js';
import { authenticate } from '../middleware/auth.js';
import { requireContentEditor } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugParams } from '../validators/shared.js';
import {
  createSermonSchema,
  sermonQuerySchema,
  updateSermonSchema,
} from '../validators/sermonSchemas.js';

/* Routes: /api/sermons (+ /api/series, /api/speakers). */
const router = Router();

// Public reads. Static routes registered BEFORE the :slug catch-all.
router.get('/', validate({ query: sermonQuerySchema }), asyncHandler(sermonController.list));
router.get('/featured', asyncHandler(sermonController.featured));
router.get('/:slug', validate({ params: slugParams }), asyncHandler(sermonController.getBySlug));

// Protected CRUD (EDITOR and above).
router.post(
  '/',
  authenticate,
  requireContentEditor,
  validate({ body: createSermonSchema }),
  asyncHandler(sermonController.create),
);
router.put(
  '/:slug',
  authenticate,
  requireContentEditor,
  validate({ params: slugParams, body: updateSermonSchema }),
  asyncHandler(sermonController.update),
);
router.delete(
  '/:slug',
  authenticate,
  requireContentEditor,
  validate({ params: slugParams }),
  asyncHandler(sermonController.remove),
);

export const seriesRouter = Router();
seriesRouter.get('/', asyncHandler(sermonController.series));

export const speakersRouter = Router();
speakersRouter.get('/', asyncHandler(sermonController.speakers));

export default router;
