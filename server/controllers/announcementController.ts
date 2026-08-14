import type { Request, Response } from 'express';
import { announcementService } from '../services/announcementService.js';

/* HTTP glue for announcements. */
export const announcementController = {
  // Public: active only. Authenticated editors may request all with ?all=true.
  async list(req: Request, res: Response) {
    const wantsAll = req.query.all === 'true' && req.user;
    res.json(wantsAll ? await announcementService.listAll() : await announcementService.listActive());
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await announcementService.create(req.body));
  },
  async update(req: Request, res: Response) {
    res.json(await announcementService.update(req.params.id, req.body));
  },
  async remove(req: Request, res: Response) {
    await announcementService.remove(req.params.id);
    res.status(204).send();
  },
};
