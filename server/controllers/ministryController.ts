import type { Request, Response } from 'express';
import { ministryService } from '../services/ministryService.js';

/* HTTP glue for ministries. */
export const ministryController = {
  async list(req: Request, res: Response) {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    res.json(await ministryService.list(category));
  },
  async getBySlug(req: Request, res: Response) {
    res.json(await ministryService.getBySlug(req.params.slug));
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await ministryService.create(req.body));
  },
  async update(req: Request, res: Response) {
    res.json(await ministryService.update(req.params.slug, req.body));
  },
  async remove(req: Request, res: Response) {
    await ministryService.remove(req.params.slug);
    res.status(204).send();
  },
};
