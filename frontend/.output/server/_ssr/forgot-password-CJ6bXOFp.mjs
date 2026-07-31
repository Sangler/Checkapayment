import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AuthShell } from "./AuthShell-CNh4elTZ.mjs";
import { t as api } from "./api-B-_3N63s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-CJ6bXOFp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPasswordPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)({
		type: "idle",
		message: ""
	});
	const handleSubmit = async (event) => {
		event.preventDefault();
		setStatus({
			type: "idle",
			message: ""
		});
		try {
			const response = await api.post("/auth/forgot-password", { email });
			setStatus({
				type: "success",
				message: response.data.message
			});
		} catch (error) {
			const message = error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response ? error.response.data?.error || "Unable to dispatch the recovery link." : "Unable to dispatch the recovery link.";
			setStatus({
				type: "error",
				message
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		badge: "RECOVERY // TIER 2 AUTH",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Restore your ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary",
				children: "signer session"
			}),
			"."
		] }),
		subtitle: "We'll dispatch a signed recovery link to the operator email on file. Payment splitter keys are unaffected.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-5",
			onSubmit: handleSubmit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "email",
					className: "mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
					children: "Verified operator email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "email",
					type: "email",
					placeholder: "treasury@company.com",
					value: email,
					onChange: (event) => setEmail(event.target.value),
					className: "w-full rounded-md border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-card/50 p-4 font-mono text-xs leading-relaxed text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "uppercase tracking-widest text-foreground",
							children: "Notice"
						})]
					}), "Password recovery only restores console access. Wallet signer keys, hardware devices, and multi-sig quorums remain unchanged."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					className: "group flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90",
					children: ["Dispatch Recovery Link", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono transition-transform group-hover:translate-x-1",
						children: "→"
					})]
				}),
				status.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `text-sm ${status.type === "error" ? "text-red-500" : "text-primary"}`,
					children: status.message
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pt-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-muted-foreground hover:text-foreground",
						children: "← Back to sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/register",
						className: "font-medium text-primary hover:underline",
						children: "Request access"
					})]
				})
			]
		})
	});
}
//#endregion
export { ForgotPasswordPage as component };
