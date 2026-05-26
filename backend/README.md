# Swift Wheels Production Backend

A production-ready Express ES module + MySQL backend for a real bus ticket reservation system.

## What it includes

- Session authentication with secure cookies
- Customer and fleet manager roles
- Fleet manager CRUD for buses, routes, schedules
- Customer search by source, destination, and departure date
- Real-time seat availability per schedule
- Transaction-safe ticket reservation to prevent double-booking seats
- MySQL constraints, indexes, foreign keys, and seed data
- Validation with Joi
- Rate limiting, Helmet security headers, CORS, compression
- Structured request logging
- Clean routes/controllers/services/repositories architecture

## Quick start

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

API runs at `http://localhost:1000` by default.

## Default seed users

Fleet Manager:
- email: `manager@swiftwheels.com`
- password: `Manager@12345`

Customer:
- email: `customer@swiftwheels.com`
- password: `Customer@12345`

## Production notes

Set these in production:

```env
NODE_ENV=production
SESSION_COOKIE_SECURE=true
SESSION_SECRET=a_very_long_random_secret
FRONTEND_URL=https://your-frontend-domain.com
```

Use HTTPS, a managed MySQL database, proper backups, and run behind a process manager such as PM2 or Docker/Kubernetes.

## Main endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Public search
- `GET /api/search/routes?source=Kigali&destination=Musanze&date=2026-05-25`
- `GET /api/search/schedules/:scheduleId/seats`

### Tickets
- `POST /api/tickets`
- `GET /api/tickets/my`
- `GET /api/tickets/:ticketId`
- `PATCH /api/tickets/:ticketId/cancel`

### Fleet manager
- `GET/POST/PATCH/DELETE /api/fleet/buses`
- `GET/POST/PATCH/DELETE /api/fleet/routes`
- `GET/POST/PATCH/DELETE /api/fleet/schedules`
- `GET /api/fleet/overview`
