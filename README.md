# Ledger-based Banking API

A Node.js / Express REST API for a ledger-based banking system with JWT authentication, account management, and atomic money transfers. Balances are never stored directly — they're derived from an immutable double-entry ledger, so every transaction leaves a verifiable audit trail.

**Live demo:** https://backend-based-ledger-system.onrender.com

## Features

- Registration, login, and logout with JWT (httpOnly cookie or `Authorization: Bearer` header)
- Token blacklisting on logout, with automatic TTL expiry (3 days)
- One account per user, with `ACTIVE` / `FROZEN` / `CLOSED` status
- Double-entry ledger: every transaction writes a `DEBIT` and a `CREDIT` entry; account balance is computed by aggregation, not stored
- Idempotent transaction creation via a required `idempotencyKey`, with `PENDING` / `COMPLETED` / `FAILED` / `REVERSED` status tracking
- MongoDB sessions/transactions to keep the transaction record and both ledger entries atomic
- System-user-only endpoint for seeding initial funds into an account
- Email notifications (registration, transaction success/failure ) via Nodemailer over Gmail OAuth2

## Tech stack

Node.js, Express 5, MongoDB / Mongoose, JWT (`jsonwebtoken`), bcrypt, Nodemailer, dotenv

## Project structure

```
server.js              # entrypoint: loads env, connects DB, starts server
src/
  app.js                # Express app, middleware, route mounting
  config/db.js           # MongoDB connection
  routes/                # auth, account, transaction routes
  controllers/            # request handlers / business logic
  models/                  # user, account, transaction, ledger, tokenBlackList schemas
  middleware/              # JWT auth (regular + system-user)
  services/                # email notifications
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB instance
- Gmail OAuth2 credentials (for email notifications)

### Install & run

```bash
npm install
npm start        # production
npm run dev       # development, auto-reload via nodemon
```

The server listens on port `3000` (hardcoded in `server.js`).

### Environment variables

Create a `.env` file at the project root:

```env
PORT=3000
mongodb_url=mongodb://localhost:27017/bankingSystem
jwt_secret_key=your_jwt_secret
EMAIL_USER=your-email@gmail.com
CLIENT_ID=your_gmail_oauth_client_id
CLIENT_SECRET=your_gmail_oauth_client_secret
REFRESH_TOKEN=your_gmail_oauth_refresh_token
```

## API reference

All routes are prefixed with `/api`. Endpoints marked **Auth** require a valid JWT (cookie or bearer token).

### Auth — `/api/auth`

| Method | Endpoint    | Body                             | Notes                                 |
| ------ | ----------- | -------------------------------- | --------------------------------------|
| POST   | `/register` | `email`, `name`, `password`      | Sets JWT cookie, sends welcome email  |
| POST   | `/login`    | `email`, `password`              | Sets JWT cookie                       |
| POST   | `/logout`   | —                                | Blacklists the current token          |

### Accounts — `/api/accounts` (Auth)

| Method | Endpoint                | Notes                                         |
| ------ | ----------------------- | ----------------------------------------------|
| POST   | `/newAccount`           | Create Account (only once)                    |
| GET    | `/accountInfo`          | Lists the caller's accounts                   |
| GET    | `/balance/:accountId`   | Computed from ledger entries; ownership-checked|

### Transactions — `/api/transactions`

| Method | Endpoint                 | Auth              | Body                                                               |
| ------ | ------------------------ | ------------------ | ---------------------------------------------------------------- |
| POST   | `/`                      | Regular user       | `fromAccount`, `toAccount`, `amount`, `idempotencyKey`           |
| POST   | `/system/initial-funds`  | System user only   | `toAccount`, `amount`, `idempotencyKey`                         |

## Notes

- Passwords are hashed with bcrypt before storage; the `password` field is excluded from query results by default.
- `systemUser` accounts are a hidden, immutable flag on the user model — required for the initial-funds endpoint.
- Ledger entries are immutable at the schema level: any update/delete operation on them throws.

## License

ISC
