import type { Request, Response } from 'express';
import { sermonService } from '../services/sermonService.js';
import type { SermonQueryInput } from '../validators/sermonSchemas.js';

/* HTTP glue for sermons, series & speakers. */
export const sermonController = {
  async list(req: Request, res: Response) {
    res.json(await sermonService.list(req.query as unknown as SermonQueryInput));
  },
  async featured(_req: Request, res: Response) {
    res.json(await sermonService.getFeatured());
  },
  async series(_req: Request, res: Response) {
    res.json(await sermonService.listSeries());
  },
  async speakers(_req: Request, res: Response) {
    res.json(await sermonService.listSpeakers());
  },
  async getBySlug(req: Request, res: Response) {
    res.json(await sermonService.getBySlug(req.params.slug));
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await sermonService.create(req.body));
  },
  async update(req: Request, res: Response) {
    res.json(await sermonService.update(req.params.slug, req.body));
  },
  async remove(req: Request, res: Response) {
    await sermonService.remove(req.params.slug);
    res.status(204).send();
  },
};
