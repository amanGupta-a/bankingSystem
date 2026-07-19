# Banking System API

A Node.js / Express backend for a simple banking ledger system with user authentication, account management, and transaction processing.

## Features

- User registration, login, and logout
- JWT-based authentication with cookie support
- Account creation and balance lookup
- Transaction creation with idempotency handling
- Initial funds transfer endpoint for system users
- Email notifications for registration and transaction events
- MongoDB database storage via Mongoose

## Technologies

- Node.js
- Express
- MongoDB / Mongoose
- bcrypt
- JSON Web Tokens (`jsonwebtoken`)
- Nodemailer
- dotenv

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance available
- Gmail OAuth2 credentials configured for sending email

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file at the project root and provide the following values:

```env
PORT=3000
mongodb_url=mongodb://localhost:27017/bankingSystem
jwt_secret_key=your_jwt_secret
EMAIL_USER=your-email@gmail.com
CLIENT_ID=your_gmail_oauth_client_id
CLIENT_SECRET=your_gmail_oauth_client_secret
REFRESH_TOKEN=your_gmail_oauth_refresh_token
```

### Run the app

```bash
npm start
```

For development with automatic reload:

```bash
npm run dev
```

The server listens on port `3000` by default.

## API Endpoints

### Authentication

#### Register

- URL: `POST /api/auth/register`
- Body:
  - `email` (string)
  - `name` (string)
  - `password` (string)

#### Login

- URL: `POST /api/auth/login`
- Body:
  - `email` (string)
  - `password` (string)

#### Logout

- URL: `POST /api/auth/logout`
- Authentication: cookie or `Authorization: Bearer <token>`

### Accounts

All account endpoints require authentication via cookie or bearer token.

#### Create account

- URL: `POST /api/accounts/create`
- Creates a new account for the authenticated user.

#### Get user accounts

- URL: `GET /api/accounts/accountInfo`
- Returns all accounts belonging to the authenticated user.

#### Get account balance

- URL: `GET /api/accounts/balance/:accountId`
- Returns the balance for the specified account if the authenticated user owns it.

### Transactions

All transaction endpoints require authentication.

#### Create transaction

- URL: `POST /api/transactions/`
- Body:
  - `fromAccount` (account ID)
  - `toAccount` (account ID)
  - `amount` (number)
  - `idempotencyKey` (string)

This endpoint supports idempotency and status handling, including `COMPLETED`, `PENDING`, `FAILED`, and `REVERSED`.

#### Create initial funds transaction

- URL: `POST /api/transactions/system/initial-funds`
- Body:
  - `toAccount` (account ID)
  - `amount` (number)
  - `idempotencyKey` (string)
- Requires a system user authenticated token.

## Notes

- The app uses JWTs stored in `token` cookies and also accepts the token in `Authorization` headers.
- The email service is configured for Gmail OAuth2 via `nodemailer`.
- User passwords are hashed with `bcrypt` before storing in MongoDB.

## Project Structure

- `server.js` - app entrypoint
- `src/app.js` - Express app configuration and routes
- `src/config/db.js` - MongoDB connection
- `src/routes/` - route definitions
- `src/controllers/` - request handlers
- `src/models/` - Mongoose schemas
- `src/middleware/` - JWT authentication middleware
- `src/services/` - email notification service

## License
