import { Router } from 'express';
import { eventController } from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';
import { requireContentEditor } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugParams } from '../validators/shared.js';
import {
  createEventSchema,
  eventFeaturedQuerySchema,
  eventQuerySchema,
  updateEventSchema,
} from '../validators/eventSchemas.js';

/* Routes: /api/events */
const router = Router();

router.get('/', validate({ query: eventQuerySchema }), asyncHandler(eventController.list));
router.get(
  '/featured',
  validate({ query: eventFeaturedQuerySchema }),
  asyncHandler(eventController.featured),
);
router.get('/:slug', validate({ params: slugParams }), asyncHandler(eventController.getBySlug));

router.post(
  '/',
  authenticate,
  requireContentEditor,
  validate({ body: createEventSchema }),
  asyncHandler(eventController.create),
);
router.put(
  '/:slug',
  authenticate,
  requireContentEditor,
  validate({ params: slugParams, body: updateEventSchema }),
  asyncHandler(eventController.update),
);
router.delete(
  '/:slug',
  authenticate,
  requireContentEditor,
  validate({ params: slugParams }),
  asyncHandler(eventController.remove),
);

export default router;
