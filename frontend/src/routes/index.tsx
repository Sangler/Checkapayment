import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import dashboardImg from "../assets/dashboard.jpg";
import { getFeeItems } from "../lib/fees";
import { api } from "../lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CheckAPay — Simple Stablecoin Billing for Small Business" },
      {
        name: "description",
        content:
          "CheckAPay helps restaurants, shops, and service businesses send simple bills with a QR code or link and get paid with stablecoin. Cash out to FIAT when you are ready.",
      },
      { property: "og:title", content: "CheckAPay — Simple Stablecoin Billing" },
      {
        property: "og:description",
        content:
          "CheckAPay helps restaurants, shops, and service businesses send simple bills with a QR code or link and get paid with stablecoin. Cash out to FIAT when you are ready.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  // Signed-in visitors land on their dashboard instead of the marketing page.
  useEffect(() => {
    let active = true;

    api
      .get("/auth/me")
      .then(() => {
        if (active) navigate({ to: "/dashboard" });
      })
      .catch(() => {
        // Not authenticated — stay on the landing page.
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const slides = [
    {
      title: "Invoice flow",
      caption: "Send, approve, and settle cross-border invoices in one place.",
      image: dashboardImg,
    },
    {
      title: "Treasury visibility",
      caption: "Monitor balances, approvals, and settlement status in real time.",
      image: dashboardImg,
    },
    {
      title: "Instant settlement",
      caption: "Move funds globally with stablecoin rails and low-cost execution.",
      image: dashboardImg,
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const showSlide = (direction: "next" | "prev") => {
    setActiveSlide((current) => {
      if (direction === "next") {
        return (current + 1) % slides.length;
      }

      return (current - 1 + slides.length) % slides.length;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <span className="font-display text-xl font-extrabold tracking-tighter">
              CheckAPay<span className="text-primary">.</span>
            </span>
            <div className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
              <a href="#solutions" className="transition-colors hover:text-foreground">
                Solutions
              </a>
              <a href="#network" className="transition-colors hover:text-foreground">
                Network
              </a>
              <Link to="/about" className="transition-colors hover:text-foreground">
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Log in
            </Link>
            <Link to="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
              Start Transacting
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Split Screen */}
      <section className="relative grid min-h-[85vh] border-b border-border lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Content */}
        <div className="animate-entrance min-w-0 flex flex-col justify-center p-8 lg:p-24">
          <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-xs text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            QR PAYMENTS • FIAT CASHOUT
          </div>

          <h1 className="mb-8 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-balance lg:text-7xl">
            Simple stablecoin billing for <span className="text-primary">merchants and small businesses</span>.
          </h1>

          <p className="mb-10 max-w-[50ch] text-lg leading-relaxed text-muted-foreground">
            Create a bill, send a QR code or link, and let customers pay with stablecoin and cash out to your native currency in your bank account when you are ready. Restaurants, kiosk sellers, merchants and B2Bs new payment methods.
          </p>

          <div className="mb-16 flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Traditional Billing
              </span>
              <span className="text-xl font-semibold opacity-50 line-through">3–5 days • extra steps • bank delays</span>
            </div>
            <div className="hidden h-12 w-px self-center bg-border sm:block"></div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
                CheckAPay
              </span>
              <span className="text-xl font-semibold text-primary">Fast • Simple • Low fee</span>
            </div>
          </div>

          <div className="flex items-center gap-8 border-t border-border pt-10">
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold">0.5%</span>
              <span className="text-xs uppercase tracking-tighter text-muted-foreground">
                Per  Paid  Bill
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold">0s</span>
              <span className="text-xs uppercase tracking-tighter text-muted-foreground">
                Payment Time
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold">Stablecoin</span>
              <span className="text-xs uppercase tracking-tighter text-muted-foreground">
                Cashout
              </span>
            </div>
          </div>
        </div>

        {/* Right Visual (Dashboard) */}
        <div className="animate-entrance relative flex min-w-0 items-center justify-center overflow-hidden border-l border-border bg-surface p-8 lg:p-12 [&]:[animation-delay:200ms]">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            <div className="flex h-10 items-center gap-2 border-b border-border bg-surface/50 px-4">
              <div className="size-2.5 rounded-full bg-border"></div>
              <div className="size-2.5 rounded-full bg-border"></div>
              <div className="size-2.5 rounded-full bg-border"></div>
              <span className="ml-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                INVOICE_FLOW_v1.0
              </span>
            </div>
            <div className="p-6">
              <div className="overflow-hidden rounded-xl border border-border/80 bg-surface">
                <div className="relative">
                  <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                    {slides.map((slide, index) => (
                      <div key={`${slide.title}-${index}`} className="min-w-full">
                        <img
                          src={slide.image}
                          alt={slide.caption}
                          width={1200}
                          height={900}
                          className="aspect-[4/3] w-full bg-surface object-cover"
                        />
                        <div className="border-t border-border bg-background/95 px-4 py-4 sm:px-6">
                          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                            {slide.title}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">{slide.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => showSlide("prev")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border/80 bg-background/85 p-2 text-foreground shadow-md backdrop-blur transition hover:bg-background"
                    aria-label="Previous slide"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => showSlide("next")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border/80 bg-background/85 p-2 text-foreground shadow-md backdrop-blur transition hover:bg-background"
                    aria-label="Next slide"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={`${slide.title}-dot-${index}`}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full transition-all ${activeSlide === index ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/70"}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 h-64 w-64 bg-primary/10 blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 h-64 w-64 bg-primary/5 blur-[100px]"></div>
        </div>
      </section>

      <section className="border-b border-border bg-card/40 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-primary">// PRICING</div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">Fees users can see before they sign up</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-3 text-sm font-semibold text-foreground">Personal account</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {getFeeItems("personal").map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-3 text-sm font-semibold text-foreground">Business account</div>
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

      {/* Trust Band */}
      <div className="border-b border-border py-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6 opacity-40 grayscale">
          <span className="font-display text-xl font-bold tracking-tight">FORBES</span>
          <span className="font-display text-xl font-bold tracking-tight">TECHCRUNCH</span>
          <span className="font-display text-xl font-bold tracking-tight">REUTERS</span>
          <span className="font-display text-xl font-bold tracking-tight">BLOOMBERG</span>
          <span className="font-display text-xl font-bold tracking-tight">WASH-POST</span>
        </div>
      </div>

      {/* Grid Content */}
      <section id="solutions" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="animate-entrance space-y-4 [&]:[animation-delay:300ms]">
            <div className="grid size-10 place-items-center rounded bg-primary/10 border border-primary/20">
              <div className="size-4 bg-primary"></div>
            </div>
            <h3 className="font-display text-xl font-bold">Simple Payments</h3>
            <p className="leading-relaxed text-muted-foreground">
              Accept stablecoin payments from customers in minutes without a complicated setup.
            </p>
          </div>

          <div className="animate-entrance space-y-4 [&]:[animation-delay:400ms]">
            <div className="grid size-10 place-items-center rounded bg-primary/10 border border-primary/20">
              <div className="size-4 border-2 border-primary"></div>
            </div>
            <h3 className="font-display text-xl font-bold">QR Codes & Links</h3>
            <p className="leading-relaxed text-muted-foreground">
              Send a bill with a QR code or a short link that expires after a set time.
            </p>
          </div>

          <div className="animate-entrance space-y-4 [&]:[animation-delay:500ms]">
            <div className="grid size-10 place-items-center rounded bg-primary/10 border border-primary/20">
              <div className="size-4 rotate-45 bg-primary"></div>
            </div>
            <h3 className="font-display text-xl font-bold">Cash Out to FIAT</h3>
            <p className="leading-relaxed text-muted-foreground">
              When the payment is done, convert the balance to your local currency and move it to your bank account.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-16 grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <span className="mb-4 inline-block font-mono text-[10px] uppercase tracking-widest text-primary">
                / 04 — Documentation
              </span>
              <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight lg:text-5xl">
                Simple answers for everyday business owners.
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              From restaurants to freelancers to B2B billing, we make it easy to send a bill, collect stablecoin, and cash out to CAD.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
            {/* Category rail */}
            <aside className="hidden lg:block">
              <ul className="sticky top-24 space-y-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <li>
                  <a href="#faq-settlement" className="text-foreground">
                    01 Settlement
                  </a>
                </li>
                <li>
                  <a href="#faq-assets" className="transition-colors hover:text-foreground">
                    02 Assets
                  </a>
                </li>
                <li>
                  <a href="#faq-invoicing" className="transition-colors hover:text-foreground">
                    03 Invoicing
                  </a>
                </li>
                <li>
                  <a href="#faq-splitter" className="transition-colors hover:text-foreground">
                    04 Splitter Fees
                  </a>
                </li>
              </ul>
            </aside>

            <div className="space-y-16">
              {/* Settlement */}
              <div id="faq-settlement" className="scroll-mt-24">
                <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                  <span className="font-mono text-xs text-primary">01</span>
                  <h3 className="font-display text-2xl font-bold">Settlement Times</h3>
                </div>
                <div className="divide-y divide-border">
                  <details className="group py-6" open>
                    <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold">
                      How fast does an invoice actually settle?
                      <span className="mt-1 font-mono text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
                      <p>
                        USDC and USDT on Base, Arbitrum, and Polygon reach finality in{" "}
                        <span className="text-foreground">2–6 seconds</span>. Ethereum L1
                        stablecoins finalize in ~15 seconds. Bitcoin invoices are marked
                        &ldquo;paid&rdquo; after 1 confirmation (~10 minutes) and irrevocable at 3
                        confirmations.
                      </p>
                      <p>
                        Fiat off-ramp settlement to the payee&rsquo;s bank runs on a T+0 rail during
                        banking hours in the US, EU, UK, and SG; otherwise next business open.
                      </p>
                    </div>
                  </details>
                  <details className="group py-6">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold">
                      When is a payment considered irreversible?
                      <span className="mt-1 font-mono text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      A payment is final the moment the Payment Splitter contract emits its{" "}
                      <code className="font-mono text-xs text-primary">PayeeReleased</code> event.
                      There are no chargebacks and no clawbacks — this is the core reason we can
                      price at 0.5%.
                    </p>
                  </details>
                  <details className="group py-6">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold">
                      What happens on network congestion?
                      <span className="mt-1 font-mono text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      Our relayer auto-bumps gas up to a treasury-defined ceiling and can re-route
                      the same invoice across chains via a hashed intent, so payees never see
                      duplicate charges.
                    </p>
                  </details>
                </div>
              </div>

              {/* Assets */}
              <div id="faq-assets" className="scroll-mt-24">
                <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                  <span className="font-mono text-xs text-primary">02</span>
                  <h3 className="font-display text-2xl font-bold">Supported Assets</h3>
                </div>

                <div className="mb-6 overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Asset</th>
                        <th className="px-4 py-3">Networks</th>
                        <th className="px-4 py-3">Finality</th>
                        <th className="px-4 py-3 text-right">Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-medium">
                      <tr>
                        <td className="px-4 py-3">USDC</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Base · Arbitrum · Ethereum · Polygon · Solana
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">2–15s</td>
                        <td className="px-4 py-3 text-right text-primary">0.5%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">USDT</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Ethereum · Arbitrum · Tron
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">2–15s</td>
                        <td className="px-4 py-3 text-right text-primary">0.5%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">PYUSD · EURC · CADC</td>
                        <td className="px-4 py-3 text-muted-foreground">Ethereum · Base</td>
                        <td className="px-4 py-3 text-muted-foreground">~15s</td>
                        <td className="px-4 py-3 text-right text-primary">0.5%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">ETH</td>
                        <td className="px-4 py-3 text-muted-foreground">Ethereum · L2s</td>
                        <td className="px-4 py-3 text-muted-foreground">~15s</td>
                        <td className="px-4 py-3 text-right text-primary">0.75%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">BTC</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Bitcoin Network Layer 1 · Lightning Network Layer 2
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">~10 min · instant</td>
                        <td className="px-4 py-3 text-right text-primary">0.8%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <details className="group border-t border-border py-6">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold">
                    Can I invoice in USD and let payers choose the asset?
                    <span className="mt-1 font-mono text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    Yes. Every invoice is denominated in a fiat unit (USD, EUR, GBP, SGD, AED).
                    Payers see a locked quote for 90 seconds across all enabled assets. The
                    Splitter converts on-chain via Uniswap v4 hooks with MEV-protected routing.
                  </p>
                </details>
              </div>

              {/* Invoicing */}
              <div id="faq-invoicing" className="scroll-mt-24">
                <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                  <span className="font-mono text-xs text-primary">03</span>
                  <h3 className="font-display text-2xl font-bold">Invoicing Workflow</h3>
                </div>

                <ol className="mb-8 grid gap-4 md:grid-cols-4">
                  {[
                    ["01", "Draft", "Import from Xero, QuickBooks, NetSuite, or our REST/GraphQL API."],
                    ["02", "Approve", "Multi-sig or role-based sign-off with per-vendor limits."],
                    ["03", "Deliver", "Payer receives a hosted invoice with a per-chain smart address."],
                    ["04", "Reconcile", "Splitter event streams back into your ledger with tx hash."],
                  ].map(([n, title, body]) => (
                    <li
                      key={n}
                      className="rounded-lg border border-border bg-surface/50 p-5"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                        Step {n}
                      </span>
                      <h4 className="mt-2 font-display text-base font-bold">{title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {body}
                      </p>
                    </li>
                  ))}
                </ol>

                <div className="divide-y divide-border">
                  <details className="group py-6">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold">
                      How does the payer actually pay?
                      <span className="mt-1 font-mono text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      Each invoice generates a unique smart contract address per chain. The payer
                      either scans a QR, connects a wallet, or triggers an ACH-to-stablecoin
                      on-ramp. The address is bound to your invoice ID, so partial and overpayments
                      are auto-detected.
                    </p>
                  </details>
                  <details className="group py-6">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold">
                      What about partial payments and refunds?
                    <span className="mt-1 font-mono text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                    </summary>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      Partial payments accrue against the invoice balance until met. Refunds are
                      issued as a new outbound payment to the payer&rsquo;s original sending
                      address, preserving the audit trail.
                    </p>
                  </details>
                  <details className="group py-6">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold">
                      Do payers need a crypto wallet?
                      <span className="mt-1 font-mono text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      No. Corporate payers can fund via ACH, SEPA, Faster Payments, or wire; we
                      convert to the invoiced stablecoin at spot and route through the same
                      Splitter contract, so vendors receive identical settlement regardless of
                      origin.
                    </p>
                  </details>
                </div>
              </div>

              {/* Splitter Fees */}
              <div id="faq-splitter" className="scroll-mt-24">
                <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                  <span className="font-mono text-xs text-primary">04</span>
                  <h3 className="font-display text-2xl font-bold">Payment Splitter & Fees</h3>
                </div>

                <div className="mb-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="min-w-0 space-y-4 leading-relaxed text-muted-foreground">
                    <p>
                      Instead of custodying funds and skimming a fee off the top, CheckAPay deploys
                      an <span className="text-foreground">immutable Payment Splitter</span>{" "}
                      contract per merchant. When a payer sends 100 USDC to an invoice address, the
                      contract atomically routes:
                    </p>
                    <ul className="space-y-2 pl-5 [&_li]:list-disc [&_li]:marker:text-primary">
                      <li>
                        <span className="text-foreground">99.5%</span> to the merchant&rsquo;s
                        treasury wallet
                      </li>
                      <li>
                        <span className="text-foreground">0.5%</span> to the CheckAPay fee vault
                      </li>
                      <li>
                        Optional splits to tax authorities, affiliates, or revenue-share partners
                      </li>
                    </ul>
                    <p>
                      No pooled custody, no float, no reconciliation gap — every basis point is
                      publicly verifiable on-chain.
                    </p>
                  </div>

                  <div className="min-w-0 rounded-lg border border-border bg-surface/60 p-5 font-mono text-xs leading-relaxed text-muted-foreground">
                    <div className="mb-3 flex items-center justify-between border-b border-border pb-2 text-[10px] uppercase tracking-widest">
                      <span>PaymentSplitter.sol</span>
                      <span className="text-primary">v1.4</span>
                    </div>
                    <pre className="w-full max-w-full overflow-x-auto">
                      <code>{`function release(IERC20 token) external {uint256 bal = token.balanceOf(this); uint256 fee = (bal * feeBps) / 10_000; token.transfer(merchant, bal - fee); token.transfer(CheckAPayVault, fee); emit PayeeReleased(invoiceId, bal);}`}</code>
                    </pre>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  <details className="group py-6" open>
                    <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold">
                      Why the 0.5%–1% band?
                      <span className="mt-1 font-mono text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
                      <p>
                        The <code className="font-mono text-xs text-primary">feeBps</code> parameter
                        is set per asset at contract deploy time and cannot be changed retroactively:
                      </p>
                      <ul className="space-y-1 pl-5 [&_li]:list-disc [&_li]:marker:text-primary">
                        <li>Stablecoins &amp; USDC/USDT/CADC/EURC — 50 bps (0.5%)</li>
                        <li>ETH invoices — 75 bps (0.75%) to cover volatility hedging</li>
                        <li>BTC invoices — 100 bps (1.0%) to cover UTXO consolidation &amp; on-ramp</li>
                      </ul>
                      <p>
                        Compared to Visa (~2.9% + $0.30) and Stripe cross-border (~3.9%), a $50k
                        invoice saves roughly $1,200 per transaction.
                      </p>
                    </div>
                  </details>
                  <details className="group py-6">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold">
                      Can I audit or upgrade the contract?
                      <span className="mt-1 font-mono text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      Yes. The Splitter is a fork of OpenZeppelin&rsquo;s{" "}
                      <code className="font-mono text-xs text-primary">PaymentSplitter</code>,
                      audited by Trail of Bits &amp; Zellic. It&rsquo;s deployed non-upgradeable;
                      new features roll out as new contract versions that you opt into by rotating
                      invoice addresses.
                    </p>
                  </details>
                  <details className="group py-6">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold">
                      Who pays the gas?
                      <span className="mt-1 font-mono text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      CheckAPay sponsors gas via ERC-4337 paymasters on all L2s and Bitcoin
                      Lightning. On Ethereum L1, gas is netted from the 0.5% fee — never charged
                      separately to your treasury.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-border bg-surface p-12 text-center lg:p-20">
          <div className="relative z-10">
            <h2 className="mb-6 font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
              Ready to make billing easier?
            </h2>
            <p className="mx-auto mb-10 max-w-[60ch] text-lg text-muted-foreground">
              Start sending simple stablecoin bills for your business and get paid faster.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="rounded-md bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:shadow-2xl hover:shadow-primary/20">
                Open Institutional Account
              </button>
              <button className="rounded-md border border-border bg-background px-8 py-4 text-lg font-semibold text-foreground transition-colors hover:bg-surface">
                Talk to Sales
              </button>
            </div>
          </div>
          {/* Background Glow */}
          <div className="bg-radial-glow pointer-events-none absolute inset-0"></div>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-extrabold tracking-tighter">
              CheckAPay<span className="text-primary">.</span>
            </span>
            <span className="text-xs text-muted-foreground">© 2026 CheckAPay Financial Inc.</span>
          </div>
          <div className="flex gap-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <a href="#" className="transition-colors hover:text-primary">
              Security
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Status
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Legal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
