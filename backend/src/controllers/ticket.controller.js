import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/ticket.service.js';
import { writeAudit } from '../middleware/audit.js';

export const create = asyncHandler(async (req,res)=> {
  const ticket = await service.reserveTicket(req.body, req.session.user);
  await writeAudit(req, 'RESERVE', 'ticket', ticket.ticket_id, { schedule_id: ticket.schedule_id, seat_number: ticket.seat_number });
  res.status(201).json({ success: true, message: 'Ticket reserved successfully.', data: { ticket } });
});
export const mine = asyncHandler(async (req,res)=> res.json({ success: true, data: { tickets: await service.getMyTickets(req.session.user.user_id) } }));
export const show = asyncHandler(async (req,res)=> res.json({ success: true, data: { ticket: await service.getTicket(req.params.ticketId, req.session.user) } }));
export const cancel = asyncHandler(async (req,res)=> {
  const ticket = await service.cancelTicket(req.params.ticketId, req.session.user);
  await writeAudit(req, 'CANCEL', 'ticket', ticket.ticket_id);
  res.json({ success: true, message: 'Ticket cancelled.', data: { ticket } });
});
