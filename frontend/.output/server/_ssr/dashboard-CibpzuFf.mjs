import { o as __toESM } from "../_runtime.mjs";
import { t as getFeeItems } from "./fees-d1YMgDb8.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as ArrowUpRight, b as Activity, c as Mail, f as Gift, g as Check, m as Copy, o as Phone, r as ShieldCheck, u as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as useSession, t as AppShell } from "./useSession-B9W-PxqQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CibpzuFf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DashboardPage() {
	const { user, state } = useSession();
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const handleCopyReferral = async () => {
		if (!user?.referralCode) return;
		try {
			await navigator.clipboard.writeText(user.referralCode);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2e3);
		} catch {}
	};
	const firstName = user?.firstName?.trim() || "there";
	formatDate(user?.createdAt);
	const kycStatus = (user?.KYCStatus || "pending").toLowerCase();
	const guest = state === "guest";
	if (state === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 font-mono text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }), "Loading your session…"]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		user,
		guest,
		searchValue: search,
		onSearchChange: setSearch,
		children: [
			state === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-8 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 font-mono text-xs text-destructive",
				children: "Couldn't reach the account service. Showing a limited view until the connection is restored."
			}) : null,
			guest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex flex-wrap items-center justify-between gap-4 rounded-md border border-primary/30 bg-primary/5 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs text-primary",
					children: "You're browsing as a guest — log in to see your account."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-xs font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-primary hover:underline",
						children: "Log in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/register",
						className: "text-primary hover:underline",
						children: "Create account"
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-xs text-primary",
						children: guest ? "GUEST // BROWSING" : "SESSION // AUTHENTICATED"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-extrabold tracking-tight lg:text-4xl",
						children: guest ? "Welcome to CheckAPay" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Welcome back, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: firstName
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: user?.email || "Your account overview and stablecoin billing activity."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }),
						label: "Email",
						value: user?.emailVerified ? "Verified" : "Pending verification",
						verified: Boolean(user?.emailVerified)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }),
						label: "Phone",
						value: user?.phoneVerified ? "Verified" : "Pending verification",
						verified: Boolean(user?.phoneVerified)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }),
						label: "KYC status",
						value: capitalize(kycStatus),
						verified: kycStatus === "approved" || kycStatus === "verified"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-4 w-4" }),
							label: "Reward points",
							value: String(user?.points ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" }),
							label: "Recent activity",
							value: "0 events"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 rounded-xl border border-border bg-card/40 p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
									children: "Referral code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-lg font-semibold tracking-widest text-foreground",
										children: user?.referralCode || "— — — — — —"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: handleCopyReferral,
										disabled: !user?.referralCode,
										className: "flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-card/60 disabled:opacity-50",
										children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied ? "Copied" : "Copy"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: "Share your code to earn points when new businesses join CheckAPay."
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-10 rounded-xl border border-border bg-card/40 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] uppercase tracking-widest text-primary",
						children: "Fee schedule"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Transparent settlement pricing"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
						children: guest ? "Personal" : "Business"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm text-muted-foreground",
					children: getFeeItems(guest ? "personal" : "business").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", item] }, item))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card/40 p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-muted-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "No activity yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-1 max-w-sm text-sm text-muted-foreground",
						children: "Bills you create, payment links you send, and stablecoin settlements will show up here."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/create-invoice",
						className: "mt-5 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-primary hover:underline",
						children: ["Create your first bill", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
					})
				]
			})
		]
	});
}
function StatusCard({ icon, label, value, verified }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-xl border border-border bg-card/40 p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `flex h-9 w-9 items-center justify-center rounded-full border ${verified ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`,
				children: icon
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold",
				children: value
			})] })]
		}), verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary" }) : null]
	});
}
function StatCard({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card/40 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-2xl font-bold",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
				children: label
			})
		]
	});
}
function capitalize(value) {
	if (!value) return "Pending";
	return value.charAt(0).toUpperCase() + value.slice(1);
}
function formatDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
//#endregion
export { DashboardPage as component };
