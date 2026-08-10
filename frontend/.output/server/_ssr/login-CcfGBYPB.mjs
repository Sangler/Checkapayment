import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./api-B-_3N63s.mjs";
import { t as AuthShell } from "./AuthShell-CNh4elTZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CcfGBYPB.js
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
	(0, import_react.useEffect)(() => {
		const params = new URLSearchParams(window.location.search);
		const error = params.get("error");
		const missing = params.get("missing");
		if (!error) return;
		const missingFields = missing ? missing.split(",").map((field) => field.trim()).filter(Boolean).join(", ") : "";
		setStatus({
			type: "error",
			message: missingFields ? `${error} Missing fields: ${missingFields}.` : error
		});
	}, []);
	const handleGoogleLogin = () => {
		window.location.assign(`http://localhost:3000/auth/google`);
	};
	const handleFacebookLogin = () => {
		window.location.assign(`http://localhost:3000/auth/facebook`);
	};
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
					autoComplete: "current-password",
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
					children: ["LOG IN", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SsoButton, {
						label: "GOOGLE",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, { className: "h-4 w-4" }),
						onClick: handleGoogleLogin
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SsoButton, {
						label: "FACEBOOK",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FacebookIcon, { className: "h-4 w-4" }),
						onClick: handleFacebookLogin
					})]
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
		autoComplete: type === "email" ? "email" : "off",
		placeholder,
		value,
		onChange,
		className: "w-full rounded-md border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
	})] });
}
function SsoButton({ label, icon, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-card/60",
		children: [icon, label]
	});
}
function GoogleIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4285F4",
				d: "M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.54-5.17 3.54-8.8z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#34A853",
				d: "M12 24c3.24 0 5.95-1.07 7.94-2.92l-3.88-2.98c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.09C3.25 21.3 7.31 24 12 24z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FBBC05",
				d: "M5.27 14.3c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V6.61H1.27C.46 8.24 0 10.06 0 12s.46 3.76 1.27 5.39z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#EA4335",
				d: "M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.61l4 3.09C6.22 6.86 8.87 4.75 12 4.75z"
			})
		]
	});
}
function FacebookIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className,
		"aria-hidden": "true",
		fill: "none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "10",
			fill: "#1877F2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M13.2 20v-7.2h2.4l.3-2.8h-2.7V4.8c0-.8.2-1.4 1.4-1.4h1.5V1.1c-.3-.1-1.1-.2-2.2-.2-2.2 0-3.7 1.3-3.7 3.8v2.1H8.3v2.8h2.4V20h2.5Z",
			fill: "white"
		})]
	});
}
//#endregion
export { LoginPage as component };
