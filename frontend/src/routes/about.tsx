import { createFileRoute, Link } from "@tanstack/react-router";
import { getFeeItems } from "../lib/fees";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CheckAPay | Simple Stablecoin Billing for Small Business" },
      {
        name: "description",
        content:
          "CheckAPay helps small businesses, restaurants, and freelancers send simple bills with QR codes or links and get paid with stablecoin. Cash out to CAD when you are ready.",
      },
      { property: "og:title", content: "About — CheckAPay" },
      {
        property: "og:description",
        content:
          "CheckAPay makes it simple for businesses to bill customers, pay freelancers, and cash out to CAD.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-display text-xl font-extrabold tracking-tighter">
              CheckAPay<span className="text-primary">.</span>
            </Link>
            <div className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
              <Link to="/" hash="solutions" className="transition-colors hover:text-foreground">
                Solutions
              </Link>
              <Link to="/" hash="network" className="transition-colors hover:text-foreground">
                Network
              </Link>
              <Link to="/about" className="text-foreground">
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              Start Transacting
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/20 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-xs text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            EST. 2023 · SAN FRANCISCO · SINGAPORE
          </div>
          <h1 className="mb-8 max-w-4xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-balance lg:text-7xl">
            We make <span className="text-primary">stablecoin billing</span> simple for everyday businesses.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            CheckAPay helps restaurants, shops, merchants, contractors, freelancers, and growing teams send a bill, collect stablecoin, and cash out to native currency. A QR code or link is all it takes.
          </p>
        </div>
      </section>

      {/* Metrics band */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border lg:grid-cols-4">
          {[
            { k: "Settled to date", v: "$4.2B", d: "since 2023" },
            { k: "Active corridors", v: "47", d: "countries" },
            { k: "Median settlement", v: "1.4s", d: "on Base" },
            { k: "Fee ceiling", v: "1.0%", d: "no hidden FX" },
          ].map((m) => (
            <div key={m.k} className="bg-background p-8">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {m.k}
              </div>
              <div className="mb-1 font-display text-4xl font-extrabold tabular-nums">{m.v}</div>
              <div className="font-mono text-xs text-primary">{m.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section id="how-to-use" className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-primary">
              // OUR THESIS
            </div>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
              Old billing systems are too slow.
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              A customer pays a bill, the payment is confirmed, and the business can move on. That should be simple.
            </p>
            <p className="text-foreground">
              We give businesses a simple way to send a bill, collect stablecoin, and convert the balance to CAD. No long bank delays, no messy back-and-forth.
            </p>
            <p>
              Whether you run a restaurant, pay freelancers, or invoice other businesses, CheckAPay helps you keep the payment flow simple.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-primary">// FEE SCHEDULE</div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">See the pricing for each account type</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-3 text-sm font-semibold text-foreground">Personal</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {getFeeItems("personal").map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-3 text-sm font-semibold text-foreground">Business</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {getFeeItems("business").map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-primary">
                // OPERATORS
              </div>
              <h2 className="font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
                Ex-Stripe. Ex-Circle. Ex-JPM.
              </h2>
            </div>
            <div className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground lg:block">
              38 engineers · 12 countries
            </div>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Marcus Chen",
                role: "Co-founder, CEO",
                bio: "Led B2B invoicing at Stripe (2018–22). Shipped the ACH+card rail that moved $180B.",
              },
              {
                name: "Priya Nair",
                role: "Co-founder, CTO",
                bio: "Protocol engineer at Circle. Authored two EIPs on stablecoin settlement finality.",
              },
              {
                name: "Elena Volkov",
                role: "Head of Compliance",
                bio: "12 years at JPM Treasury Services. MiCA and BSA registered agent.",
              },
              {
                name: "David Okonkwo",
                role: "Head of Protocol",
                bio: "Ex-Uniswap Labs. Wrote the payment splitter core that clears $16M/day.",
              },
              {
                name: "Yuki Tanaka",
                role: "Head of Design",
                bio: "Built the trading terminal at Jane Street. Believes density is a virtue.",
              },
              {
                name: "Amara Diallo",
                role: "Head of Corridors",
                bio: "Opened 34 payment corridors at Wise. Now doing the same, on-chain.",
              },
            ].map((p) => (
              <div key={p.name} className="group bg-background p-8 transition-colors hover:bg-card">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md border border-border bg-card font-display text-lg font-bold text-primary">
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="mb-1 font-display text-xl font-bold">{p.name}</div>
                <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-primary">
                  {p.role}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-16">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-primary">
              // LEDGER
            </div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
              A short changelog.
            </h2>
          </div>
          <div className="space-y-px">
            {[
              { d: "2023.Q2", t: "CheckAPay incorporated. Seed led by Ribbit.", tag: "GENESIS" },
              { d: "2023.Q4", t: "Payment splitter v0 audited by Trail of Bits.", tag: "AUDIT" },
              { d: "2024.Q1", t: "Base + Arbitrum mainnet. First $1M week.", tag: "MAINNET" },
              { d: "2024.Q3", t: "$40M Series A led by Paradigm.", tag: "SERIES A" },
              { d: "2025.Q1", t: "MiCA registration in EU. USDC/EURC corridor live.", tag: "MiCA" },
              { d: "2025.Q4", t: "$482M monthly volume. Splitter v2 with L2 batching.", tag: "SCALE" },
            ].map((e) => (
              <div
                key={e.d}
                className="grid grid-cols-1 items-start gap-2 border-b border-border py-5 font-mono text-sm transition-colors hover:bg-card/40 sm:grid-cols-[110px_100px_1fr] sm:items-center sm:gap-6"
              >
                <div className="tabular-nums text-primary">{e.d}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {e.tag}
                </div>
                <div className="min-w-0 font-sans text-base text-foreground">{e.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="fees" className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-16">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-primary">
              // OPERATING PRINCIPLES
            </div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
              Four rules. No exceptions.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                n: "01",
                t: "Custody is not our business.",
                b: "Funds never touch a CheckAPay wallet. Splitter contracts route atomically. If we disappear tomorrow, your money doesn't.",
              },
              {
                n: "02",
                t: "Fees are code, not policy.",
                b: "0.5%–1% is written into the contract. We cannot raise it retroactively. You can read the bytecode.",
              },
              {
                n: "03",
                t: "Finality means finality.",
                b: "We don't wave settlement times. Base is 1.4s. Bitcoin is 60 minutes. You see it on the console.",
              },
              {
                n: "04",
                t: "Compliance is a first-class primitive.",
                b: "Every payment carries an ERP-ready receipt with counterparty attestation. Auditors love us.",
              },
            ].map((v) => (
              <div key={v.n} className="rounded-md border border-border bg-background p-8">
                <div className="mb-4 font-mono text-xs text-primary">{v.n}</div>
                <div className="mb-3 font-display text-xl font-bold">{v.t}</div>
                <p className="leading-relaxed text-muted-foreground">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="mx-auto mb-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight lg:text-6xl">
            Route your next invoice through <span className="text-primary">on-chain rails</span>.
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Provision your splitter contract in under 24 hours. No sales call required.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              Start Transacting →
            </Link>
            <Link
              to="/"
              className="rounded-md border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:flex-row">
          <div>© 2026 CheckAPay Labs · SOC 2 Type II · ISO 27001</div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <Link to="/about" className="hover:text-foreground">
              About
            </Link>
            <Link to="/login" className="hover:text-foreground">
              Log in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
