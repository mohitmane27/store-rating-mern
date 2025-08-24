# Store Rating MERN App

Implements the FullStack Intern Coding Challenge (V1.1) using MERN (MongoDB, Express, React, Node).

## Tech
- Backend: Express.js + Mongoose
- DB: MongoDB
- Frontend: React + Vite + Tailwind

## Setup

### Backend
```bash
cd server
cp .env.example .env
# edit .env if needed (MONGO_URI, JWT_SECRET, CLIENT_URL, ADMIN_*)
npm install
npm run seed   # creates default admin
npm run dev
```

### Frontend
```bash
cd client
cp src/env.example .env
npm install
npm run dev
```

Login with admin from `.env` to create stores and users.

## Features
- Role-based auth (admin, user, owner) using JWT (httpOnly cookie)
- Admin dashboard stats
- Admin: create users & stores; list with search/sort/filter
- Users: signup/login, change password, browse stores, search, rate (1-5), edit rating
- Owners: view raters and average for their store
- Validation: Name (20–60), Address (<= 400), Password (8–16 incl. uppercase & special char), Email format
- Tables support sorting (via UI controls) and searching
```