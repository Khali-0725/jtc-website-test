import type { Request, Response } from 'express';
import { locationService } from '../services/locationService.js';

/* HTTP glue for locations. */
export const locationController = {
  async list(_req: Request, res: Response) {
    res.json(await locationService.list());
  },
  async main(_req: Request, res: Response) {
    res.json(await locationService.getMainCampus());
  },
  async getBySlug(req: Request, res: Response) {
    res.json(await locationService.getBySlug(req.params.slug));
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await locationService.create(req.body));
  },
  async update(req: Request, res: Response) {
    res.json(await locationService.update(req.params.slug, req.body));
  },
  async remove(req: Request, res: Response) {
    await locationService.remove(req.params.slug);
    res.status(204).send();
  },
};
