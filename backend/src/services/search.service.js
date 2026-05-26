import { pool } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export async function listCities() {
  const [rows] = await pool.execute(`
    SELECT city FROM (
      SELECT source AS city FROM routes WHERE status = 'active'
      UNION
      SELECT destination AS city FROM routes WHERE status = 'active'
    ) cities
    ORDER BY city ASC
  `);

  return rows.map((row) => row.city);
}

export async function searchSchedules({ source, destination, date }) {
  const [rows] = await pool.execute(
    `
    SELECT 
      s.schedule_id,
      s.departure_time,
      s.arrival_time,
      s.status,

      b.bus_id,
      b.plate_number,
      b.total_seat,

      r.route_id,
      r.source,
      r.destination,
      r.price,

      (
        b.total_seat - COALESCE(COUNT(t.ticket_id), 0)
      ) AS available_seats

    FROM schedules s

    JOIN buses b 
      ON b.bus_id = s.bus_id

    JOIN routes r 
      ON r.route_id = s.route_id

    LEFT JOIN ticket t
      ON t.schedule_id = s.schedule_id
      AND t.status = 'reserved'

    WHERE LOWER(TRIM(r.source)) = LOWER(TRIM(?))
      AND LOWER(TRIM(r.destination)) = LOWER(TRIM(?))
      AND DATE(s.departure_time) = ?
      AND s.status IN ('scheduled', 'boarding')
      AND r.status = 'active'
      AND b.status = 'active'

    GROUP BY 
      s.schedule_id,
      s.departure_time,
      s.arrival_time,
      s.status,
      b.bus_id,
      b.plate_number,
      b.total_seat,
      r.route_id,
      r.source,
      r.destination,
      r.price

    HAVING available_seats > 0

    ORDER BY s.departure_time ASC
    `,
    [source, destination, date]
  );

  return rows;
}

export async function getScheduleDetails(scheduleId) {
  const [rows] = await pool.execute(
    `
    SELECT
      s.schedule_id,
      s.departure_time,
      s.arrival_time,
      s.status,

      b.bus_id,
      b.plate_number,
      b.total_seat,

      r.route_id,
      r.source,
      r.destination,
      r.price,

      (
        b.total_seat - COALESCE(COUNT(t.ticket_id), 0)
      ) AS available_seats

    FROM schedules s

    JOIN buses b 
      ON b.bus_id = s.bus_id

    JOIN routes r 
      ON r.route_id = s.route_id

    LEFT JOIN ticket t
      ON t.schedule_id = s.schedule_id
      AND t.status = 'reserved'

    WHERE s.schedule_id = ?

    GROUP BY
      s.schedule_id,
      s.departure_time,
      s.arrival_time,
      s.status,
      b.bus_id,
      b.plate_number,
      b.total_seat,
      r.route_id,
      r.source,
      r.destination,
      r.price
    `,
    [scheduleId]
  );

  if (!rows.length) {
    throw new AppError(
      'Schedule not found.',
      404,
      'SCHEDULE_NOT_FOUND'
    );
  }

  return rows[0];
}

export async function getAvailableSeats(scheduleId) {
  const [[schedule]] = await pool.execute(
    `
    SELECT
      s.schedule_id,
      b.total_seat

    FROM schedules s

    JOIN buses b 
      ON b.bus_id = s.bus_id

    WHERE s.schedule_id = ?
    `,
    [scheduleId]
  );

  if (!schedule) {
    throw new AppError(
      'Schedule not found.',
      404,
      'SCHEDULE_NOT_FOUND'
    );
  }

  const [reserved] = await pool.execute(
    `
    SELECT seat_number
    FROM ticket
    WHERE schedule_id = ?
      AND status = 'reserved'
    `,
    [scheduleId]
  );

  const reservedSet = new Set(
    reserved.map((row) => Number(row.seat_number))
  );

  return Array.from(
    { length: schedule.total_seat },
    (_, index) => ({
      seat_number: index + 1,
      available: !reservedSet.has(index + 1)
    })
  );
}