# CheckAPay (StablePAY)

> **Stablecoin-powered business payments.** Accept, send, and settle in USDC across Ethereum, Base, Polygon, Arbitrum, and Optimism — no custodian, no private keys on the server.

---

> ⚠️ **STRICT SCHEMA RULE FOR AI MODELS**: DO NOT add any new database tables or schemas without explicit permission from the user!

---

## What is CheckAPay?

CheckAPay is a crypto-native merchant payment platform that lets businesses create invoices and receive settlements in stablecoins (USDC). It works similarly to a payment processor (like Stripe), but all settlements happen on-chain using your own embedded wallet. The platform never holds your private key — it only records your wallet address and broadcasts signed transactions you produce client-side.

---

## Project Structure

```
CheckAPay/
├── frontend/          ← TanStack Start (React 19, TypeScript, Vite, TailwindCSS v4)
├── backend/           ← Express 5 (TypeScript, Node.js)
└── docker-compose.yml ← PostgreSQL 16 + Redis 7.2
```

---

## Database Architecture (Consolidated & Minimal)

The database schema is streamlined into 6 core tables:

1. **`users`** — User profile, email/auth info, and linked `evm_address`.
2. **`transactions`** — **Unified Ledger**: Invoice payments, deposits, AND outgoing transfer intents.
3. **`webauthn_credentials`** — Registered passkeys / biometric keys per user (`1 User -> N Passkeys`).
4. **`balances`** — Multi-chain cached token balances.
5. **`indexer_state`** — Block scanner state per network.
6. **`support_requests`** — Support tickets.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | TanStack Start, React 19, TypeScript, Vite 8, TailwindCSS v4, shadcn/ui (Radix UI) |
| **Backend** | Express 5, TypeScript, Node.js |
| **Database** | PostgreSQL 16 |
| **Cache / Sessions** | Redis 7.2 (via ioredis) |
| **Blockchain** | viem — Ethereum, Base, Polygon, Arbitrum, Optimism |
| **Auth** | JWT sessions, Google OAuth 2.0, Facebook OAuth, WebAuthn (passkeys), bcrypt |
| **Infrastructure** | Docker Compose |

---

## Features

- **Stablecoin settlements** — USDC on 5 EVM chains; native gas tokens (ETH, MATIC) also tracked
- **Non-custodial wallet** — Intent → Relay pattern; private key never leaves the browser
- **Multi-auth** — Email/password, Google, Facebook, WebAuthn passkeys
- **On-chain indexer** — Self-hosted polling indexer using viem multicall + event logs
- **KYB onboarding** — Business verification form with address, employment, and business details
- **Invoice / billing** — Create payment links and bills for business clients
- **Referral system** — Unique referral codes with reward points
- **Fee schedule** — Transparent settlement pricing for personal and business tiers

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose

### 1. Start Infrastructure

```bash
docker-compose up -d
```

This starts PostgreSQL on port `5432` and Redis on port `6379`.

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in your secrets
npm install
npm run dev            # runs on http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.locale   # fill in VITE_API_URL etc.
npm install
npm run dev                    # runs on http://localhost:8080
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret for signing session tokens |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth app client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth app client secret |
| `GOOGLE_OAUTH_REDIRECT_URI` | OAuth callback URL |
| `FACEBOOK_OAUTH_CLIENT_ID` | Facebook app ID |
| `FACEBOOK_OAUTH_CLIENT_SECRET` | Facebook app secret |
| `FACEBOOK_OAUTH_REDIRECT_URI` | OAuth callback URL |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated |
| `PORT` | Server port (default `3000`) |
| `NODE_ENV` | `development` or `production` |

### Frontend (`frontend/.env.locale`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:3000`) |

---

## API Endpoints

### Auth — `/auth` or `/api/auth`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Create account (email/password) |
| `POST` | `/auth/login` | Sign in (email/password) |
| `POST` | `/auth/logout` | Invalidate session |
| `GET` | `/auth/me` | Get current user |
| `POST` | `/auth/send-otp` | Send OTP code |
| `POST` | `/auth/verify-otp` | Verify OTP code |
| `POST` | `/auth/forgot-password` | Request password reset |
| `GET` | `/auth/google` | Start Google OAuth |
| `GET` | `/auth/google/callback` | Google OAuth callback |
| `GET` | `/auth/facebook` | Start Facebook OAuth |
| `GET` | `/auth/facebook/callback` | Facebook OAuth callback |

### WebAuthn — `/auth/webauthn` or `/api/auth/webauthn`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/webauthn/register-options` | Begin passkey registration |
| `POST` | `/auth/webauthn/register-verify` | Finish passkey registration |
| `POST` | `/auth/webauthn/login-options` | Begin passkey login |
| `POST` | `/auth/webauthn/login-verify` | Finish passkey login |

### Wallet — `/wallet` or `/api/wallet`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/wallet/bind` | Link an EVM address to the account |
| `POST` | `/wallet/intent` | Create unsigned transfer intent in transactions table |
| `POST` | `/wallet/relay` | Broadcast a signed transaction & mark transaction status |

---

## Wallet: Intent → Relay Flow

The backend **never holds a private key**. Every send follows this 3-step flow:

1. **PIN/Passkey step-up** → backend returns a one-time `txAuthToken`
2. **`POST /wallet/intent`** → backend validates balance on-chain, stores intent in `transactions` (`status = 'pending_signature'`), returns unsigned tx
3. **Client signs** via embedded wallet (Web3Auth / MetaMask Embedded)
4. **`POST /wallet/relay`** → backend verifies recovered signer matches intent, broadcasts raw tx, updates transaction `status = 'pending'`

---

## License

ISC
