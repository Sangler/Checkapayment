import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AuthShell } from "./AuthShell-CNh4elTZ.mjs";
import { t as api } from "./api-B-_3N63s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-B0DHjXDd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
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
			const response = await api.post("/auth/login", {
				email,
				password
			});
			setStatus({
				type: "success",
				message: response.data.message
			});
			navigate({ to: "/dashboard" });
		} catch (error) {
			const message = error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response ? error.response.data?.error || "Unable to sign in right now." : "Unable to sign in right now.";
			setStatus({
				type: "error",
				message
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		badge: "SESSION // AUTHENTICATE",
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Return to your ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary",
				children: "business dashboard"
			}),
			"."
		] }),
		subtitle: "Sign in to create bills, send QR payments, and manage your stablecoin cashouts to CAD.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-5",
			onSubmit: handleSubmit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Work email",
					id: "email",
					type: "email",
					placeholder: "treasury@company.com",
					value: email,
					onChange: (event) => setEmail(event.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "password",
						className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/forgot-password",
						className: "font-mono text-[11px] uppercase tracking-widest text-primary hover:underline",
						children: "Forgot?"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "password",
					type: "password",
					placeholder: "••••••••••••",
					value: password,
					onChange: (event) => setPassword(event.target.value),
					className: "w-full rounded-md border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary"
					}), "Keep this device authorized for 30 days"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					className: "group flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90",
					children: ["Open Dashboard", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono transition-transform group-hover:translate-x-1",
						children: "→"
					})]
				}),
				status.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `text-sm ${status.type === "error" ? "text-red-500" : "text-primary"}`,
					children: status.message
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-background px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "OR CONTINUE WITH"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SsoButton, { label: "SAML SSO" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SsoButton, { label: "Passkey" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "pt-4 text-center text-sm text-muted-foreground",
					children: [
						"No account yet?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: "font-medium text-primary hover:underline",
							children: "Create account"
						})
					]
				})
			]
		})
	});
}
function Field({ label, id, type, placeholder, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		htmlFor: id,
		className: "mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		id,
		type,
		placeholder,
		value,
		onChange,
		className: "w-full rounded-md border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
	})] });
}
function SsoButton({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-card/60",
		children: label
	});
}
//#endregion
export { LoginPage as component };
