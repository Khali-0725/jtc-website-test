import { Router } from 'express';
import authRoutes from './authRoutes.js';
import sermonRoutes, { seriesRouter, speakersRouter } from './sermonRoutes.js';
import eventRoutes from './eventRoutes.js';
import ministryRoutes from './ministryRoutes.js';
import locationRoutes from './locationRoutes.js';
import staffRoutes from './staffRoutes.js';
import announcementRoutes from './announcementRoutes.js';
import prayerRoutes from './prayerRoutes.js';
import contactRoutes from './contactRoutes.js';
import searchRoutes from './searchRoutes.js';
import userRoutes from './userRoutes.js';

/* ============================================================
   API router — mounts every module under /api.
   Paths mirror src/config/apiConfig.ts endpoint map so the frontend
   services resolve without any changes.
   ============================================================ */

const api = Router();

api.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

api.use('/auth', authRoutes);
api.use('/sermons', sermonRoutes);
api.use('/series', seriesRouter);
api.use('/speakers', speakersRouter);
api.use('/events', eventRoutes);
api.use('/ministries', ministryRoutes);
api.use('/locations', locationRoutes);
api.use('/staff', staffRoutes);
api.use('/announcements', announcementRoutes);
api.use('/prayer', prayerRoutes);
api.use('/contact', contactRoutes);
api.use('/search', searchRoutes);
api.use('/users', userRoutes);

export default api;
