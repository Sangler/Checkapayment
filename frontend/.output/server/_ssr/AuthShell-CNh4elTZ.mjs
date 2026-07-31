import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthShell-CNh4elTZ.js
var import_jsx_runtime = require_jsx_runtime();
function AuthShell({ badge, title, subtitle, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background font-sans text-foreground selection:bg-primary/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-screen",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative flex min-h-screen flex-col justify-center px-6 py-12 lg:px-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "absolute left-6 top-6 font-display text-lg font-extrabold tracking-tighter lg:hidden",
						children: ["CheckAPay", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto w-full max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 font-mono text-[11px] uppercase tracking-widest text-primary",
								children: badge
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mb-4 font-display text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl",
								children: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-10 text-base leading-relaxed text-muted-foreground",
								children: subtitle
							}),
							children
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto mt-12 flex w-full max-w-md items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-foreground",
							children: "← Back to site"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 CheckAPay" })]
					})
				]
			})
		})
	});
}
//#endregion
export { AuthShell as t };
