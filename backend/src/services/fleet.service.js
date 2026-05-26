import { pool } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export async function listBuses() {
  const [rows] = await pool.execute('SELECT * FROM buses ORDER BY created_at DESC');
  return rows;
}
export async function createBus(data) {
  const [result] = await pool.execute('INSERT INTO buses (plate_number,total_seat,status) VALUES (?,?,?)', [data.plate_number, data.total_seat, data.status]);
  return getBus(result.insertId);
}
export async function getBus(id) {
  const [rows] = await pool.execute('SELECT * FROM buses WHERE bus_id=?', [id]);
  if (!rows.length) throw new AppError('Bus not found.', 404, 'BUS_NOT_FOUND');
  return rows[0];
}
export async function updateBus(id, data) {
  await getBus(id);
  const fields = Object.keys(data).map(k => `${k}=?`).join(', ');
  await pool.execute(`UPDATE buses SET ${fields} WHERE bus_id=?`, [...Object.values(data), id]);
  return getBus(id);
}
export async function deleteBus(id) {
  await getBus(id);
  const [used] = await pool.execute('SELECT schedule_id FROM schedules WHERE bus_id=? LIMIT 1', [id]);
  if (used.length) throw new AppError('This bus is linked to schedules. Set it to retired instead of deleting.', 409, 'BUS_IN_USE');
  await pool.execute('DELETE FROM buses WHERE bus_id=?', [id]);
}

export async function listRoutes() {
  const [rows] = await pool.execute('SELECT * FROM routes ORDER BY source, destination');
  return rows;
}
export async function createRoute(data) {
  const [result] = await pool.execute('INSERT INTO routes (source,destination,price,status) VALUES (?,?,?,?)', [data.source, data.destination, data.price, data.status]);
  return getRoute(result.insertId);
}
export async function getRoute(id) {
  const [rows] = await pool.execute('SELECT * FROM routes WHERE route_id=?', [id]);
  if (!rows.length) throw new AppError('Route not found.', 404, 'ROUTE_NOT_FOUND');
  return rows[0];
}
export async function updateRoute(id, data) {
  await getRoute(id);
  const fields = Object.keys(data).map(k => `${k}=?`).join(', ');
  await pool.execute(`UPDATE routes SET ${fields} WHERE route_id=?`, [...Object.values(data), id]);
  return getRoute(id);
}
export async function deleteRoute(id) {
  await getRoute(id);
  const [used] = await pool.execute('SELECT schedule_id FROM schedules WHERE route_id=? LIMIT 1', [id]);
  if (used.length) throw new AppError('This route is linked to schedules. Disable it instead of deleting.', 409, 'ROUTE_IN_USE');
  await pool.execute('DELETE FROM routes WHERE route_id=?', [id]);
}

export async function listSchedules() {
  const [rows] = await pool.execute(`
    SELECT s.*, b.plate_number, b.total_seat, r.source, r.destination, r.price,
      (SELECT COUNT(*) FROM ticket t WHERE t.schedule_id=s.schedule_id AND t.status='reserved') AS reserved_seats
    FROM schedules s
    JOIN buses b ON b.bus_id=s.bus_id
    JOIN routes r ON r.route_id=s.route_id
    ORDER BY s.departure_time DESC
  `);
  return rows;
}
export async function createSchedule(data) {
  await validateScheduleReferences(data.bus_id, data.route_id);
  await ensureBusFree(data.bus_id, data.departure_time);
  const [result] = await pool.execute(
    'INSERT INTO schedules (bus_id,route_id,departure_time,arrival_time,status) VALUES (?,?,?,?,?)',
    [data.bus_id, data.route_id, new Date(data.departure_time), data.arrival_time ? new Date(data.arrival_time) : null, data.status]
  );
  return getSchedule(result.insertId);
}
export async function getSchedule(id) {
  const [rows] = await pool.execute(`
    SELECT s.*, b.plate_number, b.total_seat, r.source, r.destination, r.price
    FROM schedules s JOIN buses b ON b.bus_id=s.bus_id JOIN routes r ON r.route_id=s.route_id
    WHERE s.schedule_id=?`, [id]);
  if (!rows.length) throw new AppError('Schedule not found.', 404, 'SCHEDULE_NOT_FOUND');
  return rows[0];
}
export async function updateSchedule(id, data) {
  const current = await getSchedule(id);
  const nextBusId = data.bus_id || current.bus_id;
  const nextRouteId = data.route_id || current.route_id;
  const nextDeparture = data.departure_time || current.departure_time;
  await validateScheduleReferences(nextBusId, nextRouteId);
  if (data.bus_id || data.departure_time) await ensureBusFree(nextBusId, nextDeparture, id);
  const fields = Object.keys(data).map(k => `${k}=?`).join(', ');
  await pool.execute(`UPDATE schedules SET ${fields} WHERE schedule_id=?`, [...Object.values(data).map(v => v instanceof Date ? v : v), id]);
  return getSchedule(id);
}
export async function deleteSchedule(id) {
  await getSchedule(id);
  const [tickets] = await pool.execute("SELECT ticket_id FROM ticket WHERE schedule_id=? AND status='reserved' LIMIT 1", [id]);
  if (tickets.length) throw new AppError('Cannot delete a schedule that has reserved tickets. Cancel the schedule instead.', 409, 'SCHEDULE_HAS_TICKETS');
  await pool.execute('DELETE FROM schedules WHERE schedule_id=?', [id]);
}

export async function overview() {
  const [[buses]] = await pool.execute('SELECT COUNT(*) AS total FROM buses');
  const [[routes]] = await pool.execute('SELECT COUNT(*) AS total FROM routes');
  const [[schedules]] = await pool.execute("SELECT COUNT(*) AS total FROM schedules WHERE status IN ('scheduled','boarding')");
  const [[tickets]] = await pool.execute("SELECT COUNT(*) AS total, COALESCE(SUM(amount_paid),0) AS revenue FROM ticket WHERE status='reserved'");
  const [[capacity]] = await pool.execute(`
    SELECT COALESCE(SUM(b.total_seat),0) AS seats
    FROM schedules s
    JOIN buses b ON b.bus_id=s.bus_id
    WHERE s.status IN ('scheduled','boarding')
  `);
  const occupancyRate = capacity.seats ? Math.round((tickets.total / capacity.seats) * 100) : 0;
  return {
    buses: buses.total,
    routes: routes.total,
    active_schedules: schedules.total,
    reserved_tickets: tickets.total,
    revenue: tickets.revenue,
    occupancy_rate: occupancyRate
  };
}

async function validateScheduleReferences(busId, routeId) {
  const [[bus]] = await pool.execute('SELECT bus_id,status FROM buses WHERE bus_id=?', [busId]);
  if (!bus) throw new AppError('Bus not found.', 404, 'BUS_NOT_FOUND');
  if (bus.status !== 'active') throw new AppError('Bus must be active before scheduling.', 409, 'BUS_NOT_ACTIVE');
  const [[route]] = await pool.execute('SELECT route_id,status FROM routes WHERE route_id=?', [routeId]);
  if (!route) throw new AppError('Route not found.', 404, 'ROUTE_NOT_FOUND');
  if (route.status !== 'active') throw new AppError('Route must be active before scheduling.', 409, 'ROUTE_NOT_ACTIVE');
}
async function ensureBusFree(busId, departureTime, excludeScheduleId = null) {
  const params = [busId, new Date(departureTime)];
  let sql = 'SELECT schedule_id FROM schedules WHERE bus_id=? AND departure_time=? AND status != \'cancelled\'';
  if (excludeScheduleId) { sql += ' AND schedule_id != ?'; params.push(excludeScheduleId); }
  const [rows] = await pool.execute(sql, params);
  if (rows.length) throw new AppError('This bus is already assigned at that departure time.', 409, 'BUS_ALREADY_ASSIGNED');
}
