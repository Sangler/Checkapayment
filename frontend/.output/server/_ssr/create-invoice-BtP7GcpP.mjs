import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { p as FilePlusCorner } from "../_libs/lucide-react.mjs";
import { n as useSession, t as AppShell } from "./useSession-B9W-PxqQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-invoice-BtP7GcpP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CreateInvoicePage() {
	const { user, state } = useSession();
	const [search, setSearch] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		user,
		guest: state === "guest",
		searchValue: search,
		onSearchChange: setSearch,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 font-mono text-xs uppercase tracking-widest text-primary",
					children: "// BILLING"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-extrabold tracking-tight",
					children: "Create Invoice/Bill"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Send a bill to a customer and get paid with stablecoin."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card/40 p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlusCorner, { className: "h-4 w-4 text-muted-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Invoice builder is coming soon"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-1 max-w-sm text-sm text-muted-foreground",
					children: "This is where you'll create invoices and bills for your customers."
				})
			]
		})]
	});
}
//#endregion
export { CreateInvoicePage as component };
