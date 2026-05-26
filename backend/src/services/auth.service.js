import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const safeUser = (user) => ({
  user_id: user.user_id,
  fullname: user.fullname,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status
});

export async function registerUser(data) {
  const [existing] = await pool.execute('SELECT user_id FROM users WHERE email = ?', [data.email]);
  if (existing.length) throw new AppError('Email is already registered.', 409, 'EMAIL_EXISTS');

  const passwordHash = await bcrypt.hash(data.password, env.bcryptRounds);
  const [result] = await pool.execute(
    `INSERT INTO users (fullname, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
    [data.fullname, data.email, data.phone || null, passwordHash, data.role || 'customer']
  );
  const [rows] = await pool.execute('SELECT * FROM users WHERE user_id = ?', [result.insertId]);
  return safeUser(rows[0]);
}

export async function loginUser(email, password) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (!rows.length) throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');

  const user = rows[0];
  if (user.status !== 'active') throw new AppError('This account is disabled.', 403, 'ACCOUNT_DISABLED');

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  return safeUser(user);
}
