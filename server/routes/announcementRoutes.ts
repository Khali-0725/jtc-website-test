import { Router } from 'express';
import { announcementController } from '../controllers/announcementController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { requireContentEditor } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParams } from '../validators/shared.js';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from '../validators/announcementSchemas.js';

/* Routes: /api/announcements */
const router = Router();

// optionalAuthenticate lets editors pass ?all=true; anonymous users get active only.
router.get('/', optionalAuthenticate, asyncHandler(announcementController.list));

router.post(
  '/',
  authenticate,
  requireContentEditor,
  validate({ body: createAnnouncementSchema }),
  asyncHandler(announcementController.create),
);
router.put(
  '/:id',
  authenticate,
  requireContentEditor,
  validate({ params: idParams, body: updateAnnouncementSchema }),
  asyncHandler(announcementController.update),
);
router.delete(
  '/:id',
  authenticate,
  requireContentEditor,
  validate({ params: idParams }),
  asyncHandler(announcementController.remove),
);

export default router;
