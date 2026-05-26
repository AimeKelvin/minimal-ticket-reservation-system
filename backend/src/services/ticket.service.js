import { nanoid } from 'nanoid';
import { pool, transaction } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export async function reserveTicket(data, user = null) {
  return transaction(async (conn) => {
    const [[schedule]] = await conn.execute(`
      SELECT s.schedule_id, s.status, s.departure_time, b.total_seat, r.price
      FROM schedules s JOIN buses b ON b.bus_id=s.bus_id JOIN routes r ON r.route_id=s.route_id
      WHERE s.schedule_id=? FOR UPDATE
    `, [data.schedule_id]);

    if (!schedule) throw new AppError('Schedule not found.', 404, 'SCHEDULE_NOT_FOUND');
    if (!['scheduled','boarding'].includes(schedule.status)) throw new AppError('This schedule is not open for reservations.', 409, 'SCHEDULE_CLOSED');
    if (new Date(schedule.departure_time).getTime() < Date.now()) throw new AppError('Cannot reserve a ticket for a past departure.', 409, 'PAST_DEPARTURE');
    if (data.seat_number > schedule.total_seat) throw new AppError(`Seat number must be between 1 and ${schedule.total_seat}.`, 422, 'INVALID_SEAT');

    const [seatRows] = await conn.execute("SELECT ticket_id FROM ticket WHERE schedule_id=? AND seat_number=? AND status='reserved' FOR UPDATE", [data.schedule_id, data.seat_number]);
    if (seatRows.length) throw new AppError('This seat has already been reserved. Choose another seat.', 409, 'SEAT_TAKEN');

    const ticketCode = `SW-${nanoid(10).toUpperCase()}`;
    const [result] = await conn.execute(`
      INSERT INTO ticket (ticket_code, customer_name, user_id, schedule_id, seat_number, amount_paid)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [ticketCode, data.customer_name, user?.user_id || null, data.schedule_id, data.seat_number, schedule.price]);

    const [tickets] = await conn.execute(ticketDetailsSql('WHERE t.ticket_id=?'), [result.insertId]);
    return tickets[0];
  });
}

export async function getMyTickets(userId) {
  const [rows] = await pool.execute(ticketDetailsSql('WHERE t.user_id=? ORDER BY t.reserved_at DESC'), [userId]);
  return rows;
}

export async function getTicket(ticketId, user) {
  const [rows] = await pool.execute(ticketDetailsSql('WHERE t.ticket_id=?'), [ticketId]);
  if (!rows.length) throw new AppError('Ticket not found.', 404, 'TICKET_NOT_FOUND');
  const ticket = rows[0];
  if (user.role !== 'fleetmanager' && ticket.user_id !== user.user_id) throw new AppError('You cannot view this ticket.', 403, 'FORBIDDEN');
  return ticket;
}

export async function cancelTicket(ticketId, user) {
  const ticket = await getTicket(ticketId, user);
  if (ticket.status !== 'reserved') throw new AppError('Only reserved tickets can be cancelled.', 409, 'TICKET_NOT_RESERVED');
  if (new Date(ticket.departure_time).getTime() < Date.now()) throw new AppError('Cannot cancel a ticket after departure.', 409, 'DEPARTURE_PASSED');
  await pool.execute("UPDATE ticket SET status='cancelled', cancelled_at=NOW() WHERE ticket_id=?", [ticketId]);
  return getTicket(ticketId, user);
}

function ticketDetailsSql(where) {
  return `
    SELECT t.*, s.departure_time, s.arrival_time, s.status AS schedule_status,
           b.plate_number, b.total_seat, r.source, r.destination, r.price,
           u.fullname AS account_fullname, u.email AS account_email
    FROM ticket t
    JOIN schedules s ON s.schedule_id=t.schedule_id
    JOIN buses b ON b.bus_id=s.bus_id
    JOIN routes r ON r.route_id=s.route_id
    LEFT JOIN users u ON u.user_id=t.user_id
    ${where}
  `;
}
