import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { routeSearchSchema } from '../validators/search.validators.js';
import * as c from '../controllers/search.controller.js';

const router = Router();
router.get('/cities', c.cities);
router.get('/routes', validate(routeSearchSchema, 'query'), c.routes);
router.get('/schedules/:scheduleId', c.schedule);
router.get('/schedules/:scheduleId/seats', c.seats);
export default router;
