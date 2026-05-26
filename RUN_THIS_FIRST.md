# Run SwiftWheels

## 1. Backend

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Expected API:

```txt
http://localhost:1000/api/health
```

## 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Expected app:

```txt
http://localhost:5173
```

## Demo login

Fleet manager:

```txt
manager@swiftwheels.com
Manager@12345
```

Customer:

```txt
customer@swiftwheels.com
Customer@12345
```

## What to test manually

1. Login as manager.
2. Go to Fleet → Buses and create a bus.
3. Go to Fleet → Routes and create a route.
4. Go to Fleet → Schedules and assign a bus to a route.
5. Login as customer.
6. Search route/date.
7. Open schedule detail.
8. Pick one seat.
9. Confirm booking.
10. Go to My Tickets and open the digital ticket.
