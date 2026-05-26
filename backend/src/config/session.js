import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import { env } from './env.js';

const MySQLStore = MySQLStoreFactory(session);

export function createSessionMiddleware() {
  const store = new MySQLStore({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    clearExpired: true,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: env.session.maxAgeMs,
    createDatabaseTable: true,
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data'
      }
    }
  });

  return session({
    name: env.session.name,
    secret: env.session.secret,
    store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: env.session.secure,
      sameSite: env.isProduction ? 'none' : 'lax',
      maxAge: env.session.maxAgeMs
    }
  });
}
