# Personal Calendly MVP

A full-stack booking application built with React, Node.js, and MongoDB.

## Features

### Public

- View available time slots
- Book appointments (name, email, optional note)
- Email confirmation

### Admin

- Secure login
- Add/remove availability
- View bookings
- Cancel bookings
- Email notifications

## Tech Stack

**Frontend:**

- React 19 + TypeScript
- Vite
- Redux Toolkit
- Shadcn UI (custom theme: #8B5E3C)
- Tailwind CSS
- React Router

**Backend:**

- Node.js + Express
- MongoDB
- JWT Authentication
- Nodemailer
- Bcryptjs

## Setup

### Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and email credentials
npm run dev
```

**Create Admin User** (one-time):

```bash
POST http://localhost:5000/api/auth/create-admin
{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Server (.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/calendly-mvp
JWT_SECRET=your-secret-key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=your-admin-email@gmail.com
```

### Client (.env)

```
VITE_API_URL=http://localhost:5000/api
```

## Usage

1. **Admin**: Login at `/admin/login` → Set availability
2. **Public**: Visit `/` → Pick date/time → Book
3. **Emails**: Both visitor and admin receive emails

## API Endpoints

### Public

- `GET /api/bookings/slots?date=YYYY-MM-DD` - Get available slots
- `POST /api/bookings` - Create booking

### Admin (requires JWT)

- `POST /api/auth/login` - Login
- `GET /api/availability` - Get all availability
- `POST /api/availability` - Add availability
- `DELETE /api/availability/:id` - Delete availability
- `GET /api/bookings` - Get all bookings
- `DELETE /api/bookings/:id` - Cancel booking

## License

MIT
