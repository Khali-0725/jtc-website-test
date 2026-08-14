import type { Request, Response } from 'express';
import { userService } from '../services/userService.js';
import { unauthorized } from '../utils/httpError.js';
import type { UserListQuery } from '../validators/userSchemas.js';

/* HTTP glue for admin user management. */
export const userController = {
  async list(req: Request, res: Response) {
    res.json(await userService.list(req.query as unknown as UserListQuery));
  },
  async get(req: Request, res: Response) {
    res.json(await userService.get(req.params.id));
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await userService.create(req.body));
  },
  async update(req: Request, res: Response) {
    if (!req.user) throw unauthorized();
    res.json(await userService.update(req.params.id, req.body, req.user.id));
  },
  async remove(req: Request, res: Response) {
    if (!req.user) throw unauthorized();
    await userService.remove(req.params.id, req.user.id);
    res.status(204).send();
  },
};
