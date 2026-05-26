# SwiftWheels Repair Test Report

Date: 2026-05-25

## What was fixed

- Removed all live frontend mock-data dependencies.
- Removed every `created_by` reference from backend service queries and schema.
- Added real backend routes required by the current UI:
  - `GET /api/search/cities`
  - `GET /api/search/schedules/:scheduleId`
  - `GET /api/search/schedules/:scheduleId/seats`
- Corrected frontend response parsing to match backend production response shape:
  - `res.data.data.user`
  - `res.data.data.schedules`
  - `res.data.data.tickets`
  - `res.data.data.overview`
- Fixed registration to call `POST /api/auth/register`, not mock login.
- Fixed booking to send `customer_name`, numeric `schedule_id`, and numeric `seat_number`.
- Reconnected fleet buses, routes, and schedules pages to real API calls.
- Added fleet routes and fleet schedules management pages.
- Kept the clean UI style instead of replacing it with a basic template.

## Tests actually run in this environment

Frontend:

```bash
npm install
npm run build
npx tsc --noEmit
npm run lint
```

Result: passed.

Backend:

```bash
npm install
for f in $(find src -name '*.js'); do node --check "$f"; done
npm audit --audit-level=high
```

Result: passed.

## Important limitation

This sandbox does not have a running MySQL server, so I could not execute live database migration/seed/API requests here. The exact earlier crash was still validated by static inspection and removed: no backend source or schema file contains `created_by` anymore.

On your Mac, run:

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Then in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Backend URL expected by frontend:

```txt
http://localhost:1000/api
```

Demo accounts after seed:

```txt
manager@swiftwheels.com / Manager@12345
customer@swiftwheels.com / Customer@12345
```
