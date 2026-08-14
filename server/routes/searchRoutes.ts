import { Router } from 'express';
import { searchController } from '../controllers/searchController.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { searchQuerySchema } from '../validators/searchSchemas.js';

/* Routes: /api/search?q= */
const router = Router();

router.get('/', validate({ query: searchQuerySchema }), asyncHandler(searchController.query));

export default router;
