# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File | URL | Status |
| --- | --- | --- |
| `__root.tsx` | App shell — wraps every page; preserve `<Outlet />` | ✅ Done |
| `index.tsx` | `/` — Landing page | ✅ Done |
| `about.tsx` | `/about` — About / marketing page | ✅ Done |
| `login.tsx` | `/login` — Email, Google, Facebook, WebAuthn login | ✅ Done |
| `register.tsx` | `/register` — Business account registration | ✅ Done |
| `collect-info.tsx` | `/collect-info` — KYB onboarding form | ✅ Done |
| `forgot-password.tsx` | `/forgot-password` — Password recovery | ✅ Done |
| `dashboard.tsx` | `/dashboard` — Main account overview + wallet | ✅ Done |
| `create-invoice.tsx` | `/create-invoice` — Invoice / bill creation | 🚧 WIP |
| `transactions.tsx` | `/transactions` — Transaction history | 🚧 WIP |
| `settings.tsx` | `/settings` — Account settings | 🚧 WIP |
| `sitemap[.]xml.ts` | `/sitemap.xml` — SEO sitemap | ✅ Done |

## Dynamic Segments

| Pattern | URL |
| --- | --- |
| `users/index.tsx` | `/users` |
| `users/$id.tsx` | `/users/:id` (dynamic — bare `$`, no curly braces) |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment) |
| `files/$.tsx` | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.tsx` | Layout route (renders children via `<Outlet />`) |

## Notes

- `routeTree.gen.ts` is **auto-generated** by the TanStack Router Vite plugin. Never edit it manually — it is regenerated on every `npm run dev` or `npm run build`.
- Each route file exports a `Route` constant created with `createFileRoute()`.
- Use the `head()` function inside the route definition to set per-page `<title>` and `<meta>` tags for SEO.
