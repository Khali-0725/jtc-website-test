import type { Request, Response } from 'express';
import { contactService } from '../services/contactService.js';
import { unauthorized } from '../utils/httpError.js';
import type { ContactListQuery, ContactSubmitInput } from '../validators/contactSchemas.js';

/* HTTP glue for contact messages. */
export const contactController = {
  // Public submit with honeypot: silently succeed if `website` is filled.
  async submit(req: Request, res: Response) {
    const input = req.body as ContactSubmitInput;
    if (input.website && input.website.trim() !== '') {
      res.json({ ok: true });
      return;
    }
    res.json(await contactService.submit(input));
  },

  async list(req: Request, res: Response) {
    res.json(await contactService.list(req.query as unknown as ContactListQuery));
  },

  async setHandled(req: Request, res: Response) {
    if (!req.user) throw unauthorized();
    const handled = (req.body as { handled?: boolean }).handled ?? true;
    res.json(await contactService.setHandled(req.params.id, handled, req.user.id));
  },
};
