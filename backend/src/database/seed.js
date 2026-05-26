import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const managerHash = await bcrypt.hash(
  'Manager@12345',
  env.bcryptRounds
);

const customerHash = await bcrypt.hash(
  'Customer@12345',
  env.bcryptRounds
);

await pool.execute(
  `
  INSERT IGNORE INTO users 
  (fullname, email, phone, password_hash, role) 
  VALUES
  (?, ?, ?, ?, ?),
  (?, ?, ?, ?, ?)
  `,
  [
    'Fleet Manager',
    'manager@swiftwheels.com',
    '0788000000',
    managerHash,
    'fleetmanager',

    'Test Customer',
    'customer@swiftwheels.com',
    '0788111111',
    customerHash,
    'customer'
  ]
);

await pool.execute(
  `
  INSERT IGNORE INTO buses 
  (plate_number, total_seat, status) 
  VALUES
  (?, ?, ?),
  (?, ?, ?),
  (?, ?, ?)
  `,
  [
    'RAB 123 A',
    45,
    'active',

    'RAC 456 B',
    50,
    'active',

    'RAD 789 C',
    30,
    'active'
  ]
);

await pool.execute(
  `
  INSERT IGNORE INTO routes 
  (source, destination, price, status) 
  VALUES
  (?, ?, ?, ?),
  (?, ?, ?, ?),
  (?, ?, ?, ?),
  (?, ?, ?, ?)
  `,
  [
    'Kigali',
    'Musanze',
    5500,
    'active',

    'Kigali',
    'Huye',
    6000,
    'active',

    'Kigali',
    'Rubavu',
    7500,
    'active',

    'Musanze',
    'Kigali',
    5500,
    'active'
  ]
);

const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
tomorrow.setHours(8, 0, 0, 0);

const noon = new Date(tomorrow);
noon.setHours(12, 30, 0, 0);

const evening = new Date(tomorrow);
evening.setHours(17, 0, 0, 0);

const [[bus1]] = await pool.execute(
  `
  SELECT bus_id 
  FROM buses 
  WHERE plate_number = ?
  `,
  ['RAB 123 A']
);

const [[bus2]] = await pool.execute(
  `
  SELECT bus_id 
  FROM buses 
  WHERE plate_number = ?
  `,
  ['RAC 456 B']
);

const [[route1]] = await pool.execute(
  `
  SELECT route_id 
  FROM routes 
  WHERE source = ? AND destination = ?
  `,
  ['Kigali', 'Musanze']
);

const [[route2]] = await pool.execute(
  `
  SELECT route_id 
  FROM routes 
  WHERE source = ? AND destination = ?
  `,
  ['Kigali', 'Huye']
);

await pool.execute(
  `
  INSERT IGNORE INTO schedules 
  (bus_id, route_id, departure_time, arrival_time, status) 
  VALUES
  (?, ?, ?, ?, ?),
  (?, ?, ?, ?, ?)
  `,
  [
    bus1.bus_id,
    route1.route_id,
    tomorrow,
    noon,
    'scheduled',

    bus2.bus_id,
    route2.route_id,
    noon,
    evening,
    'scheduled'
  ]
);

await pool.end();

logger.info('Database seeded successfully.');