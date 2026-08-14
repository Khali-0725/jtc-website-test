import type { Request, Response } from 'express';
import { prayerService } from '../services/prayerService.js';
import { unauthorized } from '../utils/httpError.js';
import type { PrayerListQuery, PrayerSubmitInput } from '../validators/prayerSchemas.js';

/* HTTP glue for prayer requests. */
export const prayerController = {
  // Public submit. Honeypot: if `website` is filled, silently succeed
  // (return 200 {ok:true}) WITHOUT persisting — starves spam bots of signal.
  async submit(req: Request, res: Response) {
    const input = req.body as PrayerSubmitInput;
    if (input.website && input.website.trim() !== '') {
      res.json({ ok: true });
      return;
    }
    res.json(await prayerService.submit(input));
  },

  // Staff+ review list.
  async list(req: Request, res: Response) {
    res.json(await prayerService.list(req.query as unknown as PrayerListQuery));
  },

  async setHandled(req: Request, res: Response) {
    if (!req.user) throw unauthorized();
    const handled = (req.body as { handled?: boolean }).handled ?? true;
    res.json(await prayerService.setHandled(req.params.id, handled, req.user.id));
  },
};
