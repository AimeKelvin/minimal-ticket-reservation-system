import { Router } from 'express';
import authRoutes from './auth.routes.js';
import fleetRoutes from './fleet.routes.js';
import searchRoutes from './search.routes.js';
import ticketRoutes from './ticket.routes.js';
import { pingDatabase } from '../config/db.js';

const router = Router();

router.get('/health', async (req, res) => {
  const db = await pingDatabase();
  res.json({ success: true, service: 'swift-wheels-api', database: db ? 'ok' : 'down', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/fleet', fleetRoutes);
router.use('/search', searchRoutes);
router.use('/tickets', ticketRoutes);

export default router;
