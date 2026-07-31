import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as Settings } from "../_libs/lucide-react.mjs";
import { n as useSession, t as AppShell } from "./useSession-B9W-PxqQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BLl3w8lu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
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
					children: "// ACCOUNT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-extrabold tracking-tight",
					children: "Setting"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Manage your profile, security, and notification preferences."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card/40 p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4 text-muted-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Settings are coming soon"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-1 max-w-sm text-sm text-muted-foreground",
					children: "Profile, security, and notification preferences will live here."
				})
			]
		})]
	});
}
//#endregion
export { SettingsPage as component };
