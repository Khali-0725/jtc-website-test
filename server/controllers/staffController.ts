import type { Request, Response } from 'express';
import { staffService } from '../services/staffService.js';

/* HTTP glue for staff/leadership. */
export const staffController = {
  async list(_req: Request, res: Response) {
    res.json(await staffService.list());
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await staffService.create(req.body));
  },
  async update(req: Request, res: Response) {
    res.json(await staffService.update(req.params.id, req.body));
  },
  async remove(req: Request, res: Response) {
    await staffService.remove(req.params.id);
    res.status(204).send();
  },
};
