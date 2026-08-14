import type { Request, Response } from 'express';
import { eventService } from '../services/eventService.js';
import type { EventQueryInput } from '../validators/eventSchemas.js';

/* HTTP glue for events. */
export const eventController = {
  async list(req: Request, res: Response) {
    res.json(await eventService.list(req.query as unknown as EventQueryInput));
  },
  async featured(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 3;
    res.json(await eventService.getFeatured(limit));
  },
  async getBySlug(req: Request, res: Response) {
    res.json(await eventService.getBySlug(req.params.slug));
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await eventService.create(req.body));
  },
  async update(req: Request, res: Response) {
    res.json(await eventService.update(req.params.slug, req.body));
  },
  async remove(req: Request, res: Response) {
    await eventService.remove(req.params.slug);
    res.status(204).send();
  },
};
