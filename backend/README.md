# CheckAPay — Backend

> Express 5 + TypeScript API server. Handles auth, wallet intents, and the on-chain indexer.

---

> ⚠️ **STRICT SCHEMA RULE**: DO NOT add any new database tables or schemas without explicit permission from the user!

---

## Structure

```
backend/src/
├── controllers/
│   ├── authController.ts       ← Register, login, OAuth, OTP, session management
│   ├── walletController.ts     ← Wallet bind, intent creation, tx relay
│   ├── webauthnController.ts   ← Passkey registration & authentication
│   └── pinController.ts        ← PIN verification for tx step-up auth
├── db/
│   ├── postgres.ts             ← pg Pool singleton
│   └── schema.sql              ← Full database schema (tables, indexes, constraints)
├── middleware/
│   └── auth.ts                 ← JWT session cookie verification middleware
├── models/
│   ├── Users.ts                ← User CRUD (create, find, update EVM address, etc.)
│   ├── Transactions.ts         ← Unified Ledger (Invoices, Deposits, & Wallet Intents)
│   ├── WebauthnCredentials.ts  ← Stored passkey credentials (1 User -> N Passkeys)
│   └── Supports.ts             ← Support ticket model
├── routes/
│   ├── auth.routes.ts          ← Auth + OAuth endpoints
│   ├── wallet.routes.ts        ← Wallet endpoints (bind, intent, relay)
│   └── webauthn.routes.ts      ← WebAuthn endpoints
├── services/
│   ├── authStore.ts            ← Redis session + temp value store (falls back to in-memory)
│   ├── chainClients.ts         ← viem public clients per network
│   ├── indexerService.ts       ← Multi-chain balance refresh + deposit scanner
│   ├── mailService.ts          ← Nodemailer email delivery
│   ├── passwordService.ts      ← bcrypt hash + verify
│   ├── pinService.ts           ← PIN step-up verification
│   ├── tokenService.ts         ← JWT sign + verify for session tokens
│   ├── tokensConfig.ts         ← Tracked tokens (USDC + native) per chain + ERC-20 ABI
│   ├── txAuthService.ts        ← One-time tx authorization tokens
│   ├── walletService.ts        ← EVM address provisioning (deterministic from auth_subject_id)
│   └── webauthnService.ts      ← @simplewebauthn/server helpers
└── server.ts                   ← App entry point (Express setup, route mounting, indexer start)
```

---

## Running Locally

```bash
# 1. Start Postgres + Redis
docker-compose up -d   # from project root

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env   # then fill in your values

# 4. Apply the DB schema (first time only)
psql $DATABASE_URL -f src/db/schema.sql

# 5. Start dev server
npm run dev            # nodemon + ts-node on http://localhost:3000
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (nodemon + ts-node) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output from `dist/server.js` |

---

## Key Design Decisions

### Non-Custodial Wallet (Intent → Relay)

The server **never signs or holds private keys**. Send flow:

1. Client verifies PIN or passkey → receives `txAuthToken`
2. `POST /wallet/intent` — server validates balance on-chain, creates a transaction row in `transactions` with `status = 'pending_signature'`, returns unsigned tx template
3. Client signs using embedded wallet (Web3Auth / MetaMask SDK)
4. `POST /wallet/relay` — server verifies recovered signer = bound address, updates transaction `status = 'pending'`, then broadcasts raw tx

### Session Security

- Sessions are JWT-signed tokens stored as HTTP-only `SameSite=Lax` cookies
- Session IDs are stored in Redis (or in-memory fallback for dev) for instant revocation
- Login timing is normalized (dummy bcrypt compare) to prevent email enumeration

### Multi-Chain Indexer

Started automatically at server boot via `startIndexer()`:
- **Balance loop** (30 s): multicall3 `balanceOf` for every user × every tracked ERC-20
- **Deposit loop** (20 s): `getLogs` for `Transfer` events targeting any registered user address
- Resumes from `indexer_state.last_indexed_block` after restarts; idempotent via `UNIQUE(merchant_reference_id)`

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ✅ | Redis connection string |
| `JWT_SECRET` | ✅ | Secret for signing session JWTs |
| `GOOGLE_OAUTH_CLIENT_ID` | Optional | Google OAuth app client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Optional | Google OAuth app secret |
| `GOOGLE_OAUTH_REDIRECT_URI` | Optional | Google callback URL |
| `FACEBOOK_OAUTH_CLIENT_ID` | Optional | Facebook app ID |
| `FACEBOOK_OAUTH_CLIENT_SECRET` | Optional | Facebook app secret |
| `FACEBOOK_OAUTH_REDIRECT_URI` | Optional | Facebook callback URL |
| `FRONTEND_URL` | ✅ | Comma-separated allowed CORS origins |
| `PORT` | Optional | Server port (default: `3000`) |
| `NODE_ENV` | Optional | `development` or `production` |
