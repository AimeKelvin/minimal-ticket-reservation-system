import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTicketSchema } from '../validators/ticket.validators.js';
import * as c from '../controllers/ticket.controller.js';

const router = Router();
router.use(requireAuth);
router.post('/', validate(createTicketSchema), c.create);
router.get('/my', c.mine);
router.get('/:ticketId', c.show);
router.patch('/:ticketId/cancel', c.cancel);
export default router;
