import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DrEbA3Er.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var autoUpdateMode = "true";
var selfDestroying = "false";
var auto = autoUpdateMode === "true";
var autoDestroy = selfDestroying === "true";
function registerSW(options = {}) {
	const { immediate = false, onNeedReload, onNeedRefresh, onOfflineReady, onRegistered, onRegisteredSW, onRegisterError } = options;
	let wb;
	let registerPromise;
	let sendSkipWaitingMessage;
	const updateServiceWorker = async (_reloadPage = true) => {
		await registerPromise;
		if (!auto) sendSkipWaitingMessage?.();
	};
	async function register() {
		if ("serviceWorker" in navigator) {
			wb = await import("./workbox-window.prod.es5-CkHxznpn.mjs").then(({ Workbox }) => {
				return new Workbox("/sw.js", {
					scope: "/",
					type: "classic"
				});
			}).catch((e) => {
				onRegisterError?.(e);
			});
			if (!wb) return;
			sendSkipWaitingMessage = () => {
				wb?.messageSkipWaiting();
			};
			if (!autoDestroy) if (auto) {
				wb.addEventListener("activated", (event) => {
					if (event.isUpdate || event.isExternal) if (onNeedReload) onNeedReload();
					else window.location.reload();
				});
				wb.addEventListener("installed", (event) => {
					if (!event.isUpdate) onOfflineReady?.();
				});
			} else {
				let onNeedRefreshCalled = false;
				const showSkipWaitingPrompt = () => {
					onNeedRefreshCalled = true;
					wb?.addEventListener("controlling", (event) => {
						if (event.isUpdate) if (onNeedReload) onNeedReload();
						else window.location.reload();
					});
					onNeedRefresh?.();
				};
				wb.addEventListener("installed", (event) => {
					if (typeof event.isUpdate === "undefined") if (typeof event.isExternal !== "undefined") if (event.isExternal) showSkipWaitingPrompt();
					else !onNeedRefreshCalled && onOfflineReady?.();
					else !onNeedRefreshCalled && onOfflineReady?.();
					else if (!event.isUpdate) onOfflineReady?.();
				});
				wb.addEventListener("waiting", showSkipWaitingPrompt);
			}
			wb.register({ immediate }).then((r) => {
				if (onRegisteredSW) onRegisteredSW("/sw.js", r);
				else onRegistered?.(r);
			}).catch((e) => {
				onRegisterError?.(e);
			});
		}
	}
	registerPromise = register();
	return updateServiceWorker;
}
var styles_default = "/assets/styles-BUrFEkVa.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "CheckAPay — Simple Stablecoin Billing for Small Business" },
			{
				name: "description",
				content: "CheckAPay helps restaurants, shops, and service businesses send simple bills with a QR code or link and get paid with stablecoin. Cash out to CAD when you are ready."
			},
			{
				name: "author",
				content: "CheckAPay"
			},
			{
				property: "og:title",
				content: "CheckAPay — Simple Stablecoin Billing for Small Business"
			},
			{
				property: "og:description",
				content: "CheckAPay helps restaurants, shops, and service businesses send simple bills with a QR code or link and get paid with stablecoin. Cash out to CAD when you are ready."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@CheckAPay"
			},
			{
				name: "theme-color",
				content: "#7c3aed"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "CheckAPay"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	(0, import_react.useEffect)(() => {
		registerSW({ immediate: true });
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$9 = () => import("./routes-jbh98myZ.mjs");
var Route$10 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "CheckAPay — Simple Stablecoin Billing for Small Business" },
		{
			name: "description",
			content: "CheckAPay helps restaurants, shops, and service businesses send simple bills with a QR code or link and get paid with stablecoin. Cash out to FIAT when you are ready."
		},
		{
			property: "og:title",
			content: "CheckAPay — Simple Stablecoin Billing"
		},
		{
			property: "og:description",
			content: "CheckAPay helps restaurants, shops, and service businesses send simple bills with a QR code or link and get paid with stablecoin. Cash out to FIAT when you are ready."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./about-DSbLgYM3.mjs");
var Route$9 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About — CheckAPay | Simple Stablecoin Billing for Small Business" },
		{
			name: "description",
			content: "CheckAPay helps small businesses, restaurants, and freelancers send simple bills with QR codes or links and get paid with stablecoin. Cash out to CAD when you are ready."
		},
		{
			property: "og:title",
			content: "About — CheckAPay"
		},
		{
			property: "og:description",
			content: "CheckAPay makes it simple for businesses to bill customers, pay freelancers, and cash out to CAD."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./collect-info-Bmi1HrCN.mjs");
var Route$8 = createFileRoute("/collect-info")({
	head: () => ({ meta: [{ title: "Collect your info — CheckAPay" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./create-invoice-BtP7GcpP.mjs");
var Route$7 = createFileRoute("/create-invoice")({
	head: () => ({ meta: [{ title: "Create Invoice/Bill — CheckAPay" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./dashboard-CibpzuFf.mjs");
var Route$6 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — CheckAPay" }, {
		name: "description",
		content: "Manage your bills, verification status, and stablecoin settlements from your CheckAPay dashboard."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./forgot-password-CJ6bXOFp.mjs");
var Route$5 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [
		{ title: "Recover access — CheckAPay" },
		{
			name: "description",
			content: "Reset your CheckAPay account password and get back to billing, payments, and CAD cashouts."
		},
		{
			property: "og:title",
			content: "Recover access — CheckAPay Terminal"
		},
		{
			property: "og:description",
			content: "Restore access to your treasury console. Contract signer keys remain untouched."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./login-B0DHjXDd.mjs");
var Route$4 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Log in — CheckAPay" },
		{
			name: "description",
			content: "Sign in to CheckAPay to create bills, send payment links, and manage stablecoin payments and CAD cashouts."
		},
		{
			property: "og:title",
			content: "Log in — CheckAPay Terminal"
		},
		{
			property: "og:description",
			content: "Access your treasury console, active settlement flows, and payment splitter contracts."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./register-Cu5Hg0gc.mjs");
var Route$3 = createFileRoute("/register")({
	head: () => ({ meta: [
		{ title: "Get started — CheckAPay" },
		{
			name: "description",
			content: "Start using CheckAPay to send simple bills, collect stablecoin, and cash out to CAD for your business."
		},
		{
			property: "og:title",
			content: "Request access — CheckAPay Terminal"
		},
		{
			property: "og:description",
			content: "Provision your organization on the CheckAPay payment splitter. Stablecoin, ETH, and BTC settlement in minutes."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./settings-BLl3w8lu.mjs");
var Route$2 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — CheckAPay" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var BASE_URL = "";
var Route$1 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[{
			path: "/",
			changefreq: "weekly",
			priority: "1.0"
		}].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter = () => import("./transactions-CXvbjzq5.mjs");
var Route = createFileRoute("/transactions")({
	head: () => ({ meta: [{ title: "Transactions — CheckAPay" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$10.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$11
	}),
	AboutRoute: Route$9.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$11
	}),
	CollectInfoRoute: Route$8.update({
		id: "/collect-info",
		path: "/collect-info",
		getParentRoute: () => Route$11
	}),
	CreateInvoiceRoute: Route$7.update({
		id: "/create-invoice",
		path: "/create-invoice",
		getParentRoute: () => Route$11
	}),
	DashboardRoute: Route$6.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => Route$11
	}),
	ForgotPasswordRoute: Route$5.update({
		id: "/forgot-password",
		path: "/forgot-password",
		getParentRoute: () => Route$11
	}),
	LoginRoute: Route$4.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$11
	}),
	RegisterRoute: Route$3.update({
		id: "/register",
		path: "/register",
		getParentRoute: () => Route$11
	}),
	SettingsRoute: Route$2.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$11
	}),
	SitemapDotxmlRoute: Route$1.update({
		id: "/sitemap.xml",
		path: "/sitemap.xml",
		getParentRoute: () => Route$11
	}),
	TransactionsRoute: Route.update({
		id: "/transactions",
		path: "/transactions",
		getParentRoute: () => Route$11
	})
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
