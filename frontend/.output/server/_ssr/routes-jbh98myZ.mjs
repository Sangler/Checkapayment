import { o as __toESM } from "../_runtime.mjs";
import { t as getFeeItems } from "./fees-d1YMgDb8.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-jbh98myZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var dashboard_default = "/assets/dashboard-C6SxVAWE.jpg";
function Index() {
	const [activeSlide, setActiveSlide] = (0, import_react.useState)(0);
	const slides = [
		{
			title: "Invoice flow",
			caption: "Send, approve, and settle cross-border invoices in one place.",
			image: dashboard_default
		},
		{
			title: "Treasury visibility",
			caption: "Monitor balances, approvals, and settlement status in real time.",
			image: dashboard_default
		},
		{
			title: "Instant settlement",
			caption: "Move funds globally with stablecoin rails and low-cost execution.",
			image: dashboard_default
		}
	];
	(0, import_react.useEffect)(() => {
		const timer = window.setInterval(() => {
			setActiveSlide((current) => (current + 1) % slides.length);
		}, 5e3);
		return () => window.clearInterval(timer);
	}, [slides.length]);
	const showSlide = (direction) => {
		setActiveSlide((current) => {
			if (direction === "next") return (current + 1) % slides.length;
			return (current - 1 + slides.length) % slides.length;
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground font-sans selection:bg-primary/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-xl font-extrabold tracking-tighter",
							children: ["CheckAPay", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden gap-6 text-sm font-medium text-muted-foreground md:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#solutions",
									className: "transition-colors hover:text-foreground",
									children: "Solutions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#network",
									className: "transition-colors hover:text-foreground",
									children: "Network"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/about",
									className: "transition-colors hover:text-foreground",
									children: "About"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
							children: "Log in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90",
							children: "Start Transacting"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative grid min-h-[85vh] border-b border-border lg:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-entrance min-w-0 flex flex-col justify-center p-8 lg:p-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-xs text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative flex h-2 w-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-primary" })]
							}), "QR PAYMENTS • FIAT CASHOUT"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mb-8 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-balance lg:text-7xl",
							children: [
								"Simple stablecoin billing for ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary",
									children: "merchants and small businesses"
								}),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-10 max-w-[50ch] text-lg leading-relaxed text-muted-foreground",
							children: "Create a bill, send a QR code or link, and let customers pay with stablecoin and cash out to your native currency in your bank account when you are ready. Restaurants, kiosk sellers, merchants and B2Bs new payment methods."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-16 flex flex-col gap-4 sm:flex-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground",
										children: "Traditional Billing"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-semibold opacity-50 line-through",
										children: "3–5 days • extra steps • bank delays"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden h-12 w-px self-center bg-border sm:block" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono uppercase tracking-widest text-primary",
										children: "CheckAPay"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-semibold text-primary",
										children: "Fast • Simple • Low fee"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-8 border-t border-border pt-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-2xl font-bold",
										children: "0.5%"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs uppercase tracking-tighter text-muted-foreground",
										children: "Per  Paid  Bill"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-2xl font-bold",
										children: "0s"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs uppercase tracking-tighter text-muted-foreground",
										children: "Payment Time"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-2xl font-bold",
										children: "Stablecoin"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs uppercase tracking-tighter text-muted-foreground",
										children: "Cashout"
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-entrance relative flex min-w-0 items-center justify-center overflow-hidden border-l border-border bg-surface p-8 lg:p-12 [&]:[animation-delay:200ms]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-10 items-center gap-2 border-b border-border bg-surface/50 px-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-2.5 rounded-full bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-2.5 rounded-full bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-2.5 rounded-full bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
										children: "INVOICE_FLOW_v1.0"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-hidden rounded-xl border border-border/80 bg-surface",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex transition-transform duration-700 ease-out",
												style: { transform: `translateX(-${activeSlide * 100}%)` },
												children: slides.map((slide, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-full",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: slide.image,
														alt: slide.caption,
														width: 1200,
														height: 900,
														className: "aspect-[4/3] w-full bg-surface object-cover"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "border-t border-border bg-background/95 px-4 py-4 sm:px-6",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "font-mono text-[10px] uppercase tracking-[0.3em] text-primary",
															children: slide.title
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "mt-1 text-sm text-muted-foreground",
															children: slide.caption
														})]
													})]
												}, `${slide.title}-${index}`))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => showSlide("prev"),
												className: "absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border/80 bg-background/85 p-2 text-foreground shadow-md backdrop-blur transition hover:bg-background",
												"aria-label": "Previous slide",
												children: "←"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => showSlide("next"),
												className: "absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border/80 bg-background/85 p-2 text-foreground shadow-md backdrop-blur transition hover:bg-background",
												"aria-label": "Next slide",
												children: "→"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex justify-center gap-2",
									children: slides.map((slide, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setActiveSlide(index),
										className: `h-2.5 rounded-full transition-all ${activeSlide === index ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/70"}`,
										"aria-label": `Go to slide ${index + 1}`
									}, `${slide.title}-dot-${index}`))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 h-64 w-64 bg-primary/10 blur-[120px]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 h-64 w-64 bg-primary/5 blur-[100px]" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border bg-card/40 py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-background p-8 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 font-mono text-[11px] uppercase tracking-widest text-primary",
								children: "// PRICING"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl font-extrabold tracking-tight",
								children: "Fees users can see before they sign up"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 grid gap-6 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 text-sm font-semibold text-foreground",
									children: "Personal account"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2 text-sm text-muted-foreground",
									children: getFeeItems("personal").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", item] }, item))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 text-sm font-semibold text-foreground",
									children: "Business account"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2 text-sm text-muted-foreground",
									children: getFeeItems("business").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", item] }, item))
								})] })]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6 opacity-40 grayscale",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-bold tracking-tight",
							children: "FORBES"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-bold tracking-tight",
							children: "TECHCRUNCH"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-bold tracking-tight",
							children: "REUTERS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-bold tracking-tight",
							children: "BLOOMBERG"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-bold tracking-tight",
							children: "WASH-POST"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "solutions",
				className: "mx-auto max-w-7xl px-6 py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-entrance space-y-4 [&]:[animation-delay:300ms]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-10 place-items-center rounded bg-primary/10 border border-primary/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-4 bg-primary" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl font-bold",
									children: "Simple Payments"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "leading-relaxed text-muted-foreground",
									children: "Accept stablecoin payments from customers in minutes without a complicated setup."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-entrance space-y-4 [&]:[animation-delay:400ms]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-10 place-items-center rounded bg-primary/10 border border-primary/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-4 border-2 border-primary" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl font-bold",
									children: "QR Codes & Links"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "leading-relaxed text-muted-foreground",
									children: "Send a bill with a QR code or a short link that expires after a set time."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-entrance space-y-4 [&]:[animation-delay:500ms]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-10 place-items-center rounded bg-primary/10 border border-primary/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-4 rotate-45 bg-primary" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl font-bold",
									children: "Cash Out to FIAT"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "leading-relaxed text-muted-foreground",
									children: "When the payment is done, convert the balance to your local currency and move it to your bank account."
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "faq",
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 py-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-16 grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-4 inline-block font-mono text-[10px] uppercase tracking-widest text-primary",
							children: "/ 04 — Documentation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-4xl font-extrabold leading-[1.05] tracking-tight lg:text-5xl",
							children: "Simple answers for everyday business owners."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg leading-relaxed text-muted-foreground",
							children: "From restaurants to freelancers to B2B billing, we make it easy to send a bill, collect stablecoin, and cash out to CAD."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-12 lg:grid-cols-[220px_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
							className: "hidden lg:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "sticky top-24 space-y-3 font-mono text-xs uppercase tracking-widest text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#faq-settlement",
										className: "text-foreground",
										children: "01 Settlement"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#faq-assets",
										className: "transition-colors hover:text-foreground",
										children: "02 Assets"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#faq-invoicing",
										className: "transition-colors hover:text-foreground",
										children: "03 Invoicing"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#faq-splitter",
										className: "transition-colors hover:text-foreground",
										children: "04 Splitter Fees"
									}) })
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-16",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									id: "faq-settlement",
									className: "scroll-mt-24",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-6 flex items-center gap-3 border-b border-border pb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs text-primary",
											children: "01"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-2xl font-bold",
											children: "Settlement Times"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "divide-y divide-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
												className: "group py-6",
												open: true,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
													className: "flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold",
													children: ["How fast does an invoice actually settle?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mt-1 font-mono text-primary transition-transform group-open:rotate-45",
														children: "+"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-4 space-y-3 leading-relaxed text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"USDC and USDT on Base, Arbitrum, and Polygon reach finality in",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-foreground",
															children: "2–6 seconds"
														}),
														". Ethereum L1 stablecoins finalize in ~15 seconds. Bitcoin invoices are marked “paid” after 1 confirmation (~10 minutes) and irrevocable at 3 confirmations."
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Fiat off-ramp settlement to the payee’s bank runs on a T+0 rail during banking hours in the US, EU, UK, and SG; otherwise next business open." })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
												className: "group py-6",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
													className: "flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold",
													children: ["When is a payment considered irreversible?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mt-1 font-mono text-primary transition-transform group-open:rotate-45",
														children: "+"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-4 leading-relaxed text-muted-foreground",
													children: [
														"A payment is final the moment the Payment Splitter contract emits its",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
															className: "font-mono text-xs text-primary",
															children: "PayeeReleased"
														}),
														" event. There are no chargebacks and no clawbacks — this is the core reason we can price at 0.5%."
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
												className: "group py-6",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
													className: "flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold",
													children: ["What happens on network congestion?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mt-1 font-mono text-primary transition-transform group-open:rotate-45",
														children: "+"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-4 leading-relaxed text-muted-foreground",
													children: "Our relayer auto-bumps gas up to a treasury-defined ceiling and can re-route the same invoice across chains via a hashed intent, so payees never see duplicate charges."
												})]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									id: "faq-assets",
									className: "scroll-mt-24",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-6 flex items-center gap-3 border-b border-border pb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs text-primary",
												children: "02"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-2xl font-bold",
												children: "Supported Assets"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-6 overflow-hidden rounded-lg border border-border",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
												className: "w-full text-left text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
													className: "bg-surface font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "px-4 py-3",
															children: "Asset"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "px-4 py-3",
															children: "Networks"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "px-4 py-3",
															children: "Finality"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "px-4 py-3 text-right",
															children: "Fee"
														})
													] })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
													className: "divide-y divide-border font-medium",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3",
																children: "USDC"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-muted-foreground",
																children: "Base · Arbitrum · Ethereum · Polygon · Solana"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-muted-foreground",
																children: "2–15s"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-right text-primary",
																children: "0.5%"
															})
														] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3",
																children: "USDT"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-muted-foreground",
																children: "Ethereum · Arbitrum · Tron"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-muted-foreground",
																children: "2–15s"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-right text-primary",
																children: "0.5%"
															})
														] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3",
																children: "PYUSD · EURC · CADC"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-muted-foreground",
																children: "Ethereum · Base"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-muted-foreground",
																children: "~15s"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-right text-primary",
																children: "0.5%"
															})
														] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3",
																children: "ETH"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-muted-foreground",
																children: "Ethereum · L2s"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-muted-foreground",
																children: "~15s"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-right text-primary",
																children: "0.75%"
															})
														] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3",
																children: "BTC"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-muted-foreground",
																children: "Bitcoin Network Layer 1 · Lightning Network Layer 2"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-muted-foreground",
																children: "~10 min · instant"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-4 py-3 text-right text-primary",
																children: "0.8%"
															})
														] })
													]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
											className: "group border-t border-border py-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
												className: "flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold",
												children: ["Can I invoice in USD and let payers choose the asset?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-1 font-mono text-primary transition-transform group-open:rotate-45",
													children: "+"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-4 leading-relaxed text-muted-foreground",
												children: "Yes. Every invoice is denominated in a fiat unit (USD, EUR, GBP, SGD, AED). Payers see a locked quote for 90 seconds across all enabled assets. The Splitter converts on-chain via Uniswap v4 hooks with MEV-protected routing."
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									id: "faq-invoicing",
									className: "scroll-mt-24",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-6 flex items-center gap-3 border-b border-border pb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs text-primary",
												children: "03"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-2xl font-bold",
												children: "Invoicing Workflow"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
											className: "mb-8 grid gap-4 md:grid-cols-4",
											children: [
												[
													"01",
													"Draft",
													"Import from Xero, QuickBooks, NetSuite, or our REST/GraphQL API."
												],
												[
													"02",
													"Approve",
													"Multi-sig or role-based sign-off with per-vendor limits."
												],
												[
													"03",
													"Deliver",
													"Payer receives a hosted invoice with a per-chain smart address."
												],
												[
													"04",
													"Reconcile",
													"Splitter event streams back into your ledger with tx hash."
												]
											].map(([n, title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "rounded-lg border border-border bg-surface/50 p-5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-[10px] uppercase tracking-widest text-primary",
														children: ["Step ", n]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
														className: "mt-2 font-display text-base font-bold",
														children: title
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-2 text-sm leading-relaxed text-muted-foreground",
														children: body
													})
												]
											}, n))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "divide-y divide-border",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
													className: "group py-6",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
														className: "flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold",
														children: ["How does the payer actually pay?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "mt-1 font-mono text-primary transition-transform group-open:rotate-45",
															children: "+"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-4 leading-relaxed text-muted-foreground",
														children: "Each invoice generates a unique smart contract address per chain. The payer either scans a QR, connects a wallet, or triggers an ACH-to-stablecoin on-ramp. The address is bound to your invoice ID, so partial and overpayments are auto-detected."
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
													className: "group py-6",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
														className: "flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold",
														children: ["What about partial payments and refunds?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "mt-1 font-mono text-primary transition-transform group-open:rotate-45",
															children: "+"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-4 leading-relaxed text-muted-foreground",
														children: "Partial payments accrue against the invoice balance until met. Refunds are issued as a new outbound payment to the payer’s original sending address, preserving the audit trail."
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
													className: "group py-6",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
														className: "flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold",
														children: ["Do payers need a crypto wallet?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "mt-1 font-mono text-primary transition-transform group-open:rotate-45",
															children: "+"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-4 leading-relaxed text-muted-foreground",
														children: "No. Corporate payers can fund via ACH, SEPA, Faster Payments, or wire; we convert to the invoiced stablecoin at spot and route through the same Splitter contract, so vendors receive identical settlement regardless of origin."
													})]
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									id: "faq-splitter",
									className: "scroll-mt-24",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-6 flex items-center gap-3 border-b border-border pb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs text-primary",
												children: "04"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-2xl font-bold",
												children: "Payment Splitter & Fees"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 space-y-4 leading-relaxed text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"Instead of custodying funds and skimming a fee off the top, CheckAPay deploys an ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-foreground",
															children: "immutable Payment Splitter"
														}),
														" ",
														"contract per merchant. When a payer sends 100 USDC to an invoice address, the contract atomically routes:"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
														className: "space-y-2 pl-5 [&_li]:list-disc [&_li]:marker:text-primary",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-foreground",
																children: "99.5%"
															}), " to the merchant’s treasury wallet"] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-foreground",
																children: "0.5%"
															}), " to the CheckAPay fee vault"] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Optional splits to tax authorities, affiliates, or revenue-share partners" })
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No pooled custody, no float, no reconciliation gap — every basis point is publicly verifiable on-chain." })
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 rounded-lg border border-border bg-surface/60 p-5 font-mono text-xs leading-relaxed text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-3 flex items-center justify-between border-b border-border pb-2 text-[10px] uppercase tracking-widest",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PaymentSplitter.sol" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-primary",
														children: "v1.4"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
													className: "w-full max-w-full overflow-x-auto",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: `function release(IERC20 token) external {uint256 bal = token.balanceOf(this); uint256 fee = (bal * feeBps) / 10_000; token.transfer(merchant, bal - fee); token.transfer(CheckAPayVault, fee); emit PayeeReleased(invoiceId, bal);}` })
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "divide-y divide-border",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
													className: "group py-6",
													open: true,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
														className: "flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold",
														children: ["Why the 0.5%–1% band?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "mt-1 font-mono text-primary transition-transform group-open:rotate-45",
															children: "+"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-4 space-y-3 leading-relaxed text-muted-foreground",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
																"The ",
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
																	className: "font-mono text-xs text-primary",
																	children: "feeBps"
																}),
																" parameter is set per asset at contract deploy time and cannot be changed retroactively:"
															] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
																className: "space-y-1 pl-5 [&_li]:list-disc [&_li]:marker:text-primary",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Stablecoins & USDC/USDT/CADC/EURC — 50 bps (0.5%)" }),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "ETH invoices — 75 bps (0.75%) to cover volatility hedging" }),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "BTC invoices — 100 bps (1.0%) to cover UTXO consolidation & on-ramp" })
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Compared to Visa (~2.9% + $0.30) and Stripe cross-border (~3.9%), a $50k invoice saves roughly $1,200 per transaction." })
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
													className: "group py-6",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
														className: "flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold",
														children: ["Can I audit or upgrade the contract?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "mt-1 font-mono text-primary transition-transform group-open:rotate-45",
															children: "+"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "mt-4 leading-relaxed text-muted-foreground",
														children: [
															"Yes. The Splitter is a fork of OpenZeppelin’s",
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
																className: "font-mono text-xs text-primary",
																children: "PaymentSplitter"
															}),
															", audited by Trail of Bits & Zellic. It’s deployed non-upgradeable; new features roll out as new contract versions that you opt into by rotating invoice addresses."
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
													className: "group py-6",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
														className: "flex cursor-pointer items-start justify-between gap-6 font-display text-lg font-semibold",
														children: ["Who pays the gas?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "mt-1 font-mono text-primary transition-transform group-open:rotate-45",
															children: "+"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-4 leading-relaxed text-muted-foreground",
														children: "CheckAPay sponsors gas via ERC-4337 paymasters on all L2s and Bitcoin Lightning. On Ethereum L1, gas is netted from the 0.5% fee — never charged separately to your treasury."
													})]
												})
											]
										})
									]
								})
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-border bg-surface p-12 text-center lg:p-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-6 font-display text-4xl font-extrabold tracking-tight lg:text-5xl",
								children: "Ready to make billing easier?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mb-10 max-w-[60ch] text-lg text-muted-foreground",
								children: "Start sending simple stablecoin bills for your business and get paid faster."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-center gap-4 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "rounded-md bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:shadow-2xl hover:shadow-primary/20",
									children: "Open Institutional Account"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "rounded-md border border-border bg-background px-8 py-4 text-lg font-semibold text-foreground transition-colors hover:bg-surface",
									children: "Talk to Sales"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-radial-glow pointer-events-none absolute inset-0" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-sm font-extrabold tracking-tighter",
							children: ["CheckAPay", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "© 2026 CheckAPay Financial Inc."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-8 font-mono text-xs uppercase tracking-widest text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								className: "transition-colors hover:text-primary",
								children: "Security"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								className: "transition-colors hover:text-primary",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								className: "transition-colors hover:text-primary",
								children: "Legal"
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { Index as component };
