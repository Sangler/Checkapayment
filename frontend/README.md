# CheckAPay — Frontend

> TanStack Start (React 19, TypeScript, Vite 8, TailwindCSS v4). File-based routing, shadcn/ui components, embedded wallet integration.

---

## Structure

```
frontend/src/
├── components/
│   ├── AppShell.tsx            ← Authenticated layout shell (sidebar, topbar, nav)
│   ├── AuthShell.tsx           ← Unauthenticated layout shell (centered card)
│   ├── WalletCard.tsx          ← Wallet widget (balance, send, receive, bind address)
│   └── ui/                     ← shadcn/ui component library (Radix UI + Tailwind)
├── lib/
│   ├── api.ts                  ← Axios instance pointed at backend API
│   ├── embeddedWallet.ts       ← Web3Auth embedded wallet helpers (sign, send)
│   ├── fees.ts                 ← Fee schedule data for personal/business tiers
│   ├── useSession.ts           ← React hook: fetch /auth/me, manage auth state
│   ├── error-capture.ts        ← Global error boundary utilities
│   ├── error-page.ts           ← Error page helpers
│   ├── lovable-error-reporting.ts ← Dev error reporting integration
│   └── utils.ts                ← Tailwind cn() utility
├── routes/
│   ├── __root.tsx              ← App shell root (TanStack Router, QueryClient, head)
│   ├── index.tsx               ← Landing page (/)
│   ├── about.tsx               ← About page (/about)
│   ├── login.tsx               ← Login page (/login)
│   ├── register.tsx            ← Registration page (/register)
│   ├── collect-info.tsx        ← KYB onboarding form (/collect-info)
│   ├── dashboard.tsx           ← Main dashboard (/dashboard)
│   ├── create-invoice.tsx      ← Invoice creation (/create-invoice) [WIP]
│   ├── transactions.tsx        ← Transaction history (/transactions) [WIP]
│   ├── settings.tsx            ← Account settings (/settings) [WIP]
│   ├── forgot-password.tsx     ← Password recovery (/forgot-password)
│   ├── sitemap[.]xml.ts        ← Sitemap generation (/sitemap.xml)
│   └── README.md               ← Routing conventions guide
├── assets/                     ← Static assets (images, icons)
├── routeTree.gen.ts            ← Auto-generated route tree (do not edit)
├── router.tsx                  ← TanStack Router instance
├── server.ts                   ← SSR server entry (Nitro/Vite)
├── start.ts                    ← Client entry point
└── styles.css                  ← Global styles + Tailwind v4 theme tokens
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.locale   # then fill in values

# Start dev server
npm run dev    # http://localhost:8080
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Development mode build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |

---

## Routing Conventions

TanStack Start uses **file-based routing**. Every `.tsx` file in `src/routes/` maps to a URL:

| File | URL |
|------|-----|
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `dashboard.tsx` | `/dashboard` |
| `login.tsx` | `/login` |
| `register.tsx` | `/register` |
| `collect-info.tsx` | `/collect-info` |
| `create-invoice.tsx` | `/create-invoice` |
| `transactions.tsx` | `/transactions` |
| `settings.tsx` | `/settings` |
| `forgot-password.tsx` | `/forgot-password` |
| `__root.tsx` | App shell wrapping every page |

> `routeTree.gen.ts` is **auto-generated** by the TanStack Router plugin. Never edit it manually.

---

## Auth Flow

1. **`useSession`** hook calls `GET /auth/me` on mount to rehydrate user from the HTTP-only session cookie
2. State machine: `loading → authenticated | guest | error`
3. Protected routes render a guest banner or redirect to `/login` when state is `guest`
4. After login/register the backend sets a `SameSite=Lax` HTTP-only cookie automatically

---

## Wallet Integration

Embedded wallet is managed in `src/lib/embeddedWallet.ts` using **Web3Auth**:

1. User connects embedded wallet → `POST /wallet/bind` registers the EVM address server-side
2. To send funds: user verifies PIN/passkey → `POST /wallet/intent` → client signs with Web3Auth → `POST /wallet/relay`
3. The private key **never leaves the browser**

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:3000`) |

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `@tanstack/react-start` | Full-stack React framework (SSR + file routing) |
| `@tanstack/react-query` | Server state management |
| `@tanstack/react-router` | Type-safe file-based router |
| `@radix-ui/*` | Headless UI primitives (via shadcn/ui) |
| `tailwindcss` v4 | Utility-first CSS framework |
| `viem` | EVM blockchain interaction |
| `@web3auth/modal` | Embedded wallet (social login + passkeys) |
| `react-hook-form` + `zod` | Form validation |
| `axios` | HTTP client |
| `lucide-react` | Icon library |
| `recharts` | Charts (for future analytics views) |
| `sonner` | Toast notifications |
