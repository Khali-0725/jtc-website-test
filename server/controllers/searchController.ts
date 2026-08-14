import type { Request, Response } from 'express';
import { searchService } from '../services/searchService.js';

/* HTTP glue for global search. */
export const searchController = {
  async query(req: Request, res: Response) {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    res.json(await searchService.query(q));
  },
};
