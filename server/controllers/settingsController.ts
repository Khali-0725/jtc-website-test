import type { Request, Response } from 'express';
import { settingsService } from '../services/settingsService.js';

/* HTTP glue for site settings.
   - GET  is public (the site reads branding on every page load).
   - PUT  is gated to SUPER_ADMIN in the route. */
export const settingsController = {
  async get(_req: Request, res: Response) {
    res.json(await settingsService.get());
  },
  async update(req: Request, res: Response) {
    res.json(await settingsService.update(req.body));
  },
};
